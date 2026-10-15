"""모듈 2: 유튜브 자동완성 수집 (비공식 엔드포인트 — 이 파일 안에 격리)."""

from __future__ import annotations

import json
import logging
import random
import sqlite3
import time
from dataclasses import dataclass

import requests

from shortube import db
from shortube.analysis.filters import exclusion_reason, intent_of, squash
from shortube.config import Config

log = logging.getLogger(__name__)

ENDPOINT = "https://suggestqueries.google.com/complete/search"
SOURCE = "autocomplete"
CHOSEONG = list("ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ")


@dataclass
class Query:
    text: str            # 실제로 보낼 질의
    seed: str            # 원 시드 키워드 (템플릿이면 "{entity} {seed}")
    category: str
    entity: str | None
    origin: str          # seed | template


def parse_response(raw: bytes) -> list[str]:
    """응답 형식: [질의, [제안어, ...], ...]. 형식이 다르면 ValueError."""
    data = json.loads(raw.decode("utf-8"))
    if not (isinstance(data, list) and len(data) >= 2 and isinstance(data[1], list)):
        raise ValueError("예상과 다른 응답 형식")
    return [str(s).strip() for s in data[1] if str(s).strip()]


def fetch(session: requests.Session, q: str) -> list[str]:
    resp = session.get(ENDPOINT, params={"client": "firefox", "ds": "yt", "hl": "ko", "gl": "kr", "q": q},
                       timeout=10)
    resp.raise_for_status()
    try:
        return parse_response(resp.content)
    except (ValueError, json.JSONDecodeError) as e:
        log.warning("자동완성 파싱 실패 '%s': %s / 원문: %r", q, e, resp.content[:200])
        raise


def build_queries(cfg: Config, expand: bool = False) -> list[Query]:
    entity_cats = set(cfg.settings.get("entity_categories", []))
    entities = cfg.work_entities()
    queries: list[Query] = []
    for cat in cfg.enabled_categories():
        if cat.name in entity_cats:
            if not entities:
                log.warning("'%s' 카테고리: 작품(entities)이 없어 건너뜁니다. python -m shortube entities 를 먼저 실행하세요.", cat.name)
                continue
            for e in entities:
                # 작품명 단독 질의 + 시드 조합 질의
                queries.append(Query(e.name, e.name, cat.name, e.name, "template"))
                for s in cat.keywords:
                    text = f"{e.name} {s}"
                    queries.append(Query(text, text, cat.name, e.name, "template"))
        else:
            for s in cat.keywords:
                text = f"{s}{cat.suffix}"
                queries.append(Query(text, text, cat.name, None, "seed"))
    if expand:
        queries += [Query(f"{q.text} {c}", q.seed, q.category, q.entity, q.origin)
                    for q in list(queries) for c in CHOSEONG]
    seen: set[str] = set()
    unique = []
    for q in queries:
        if q.text not in seen:
            seen.add(q.text)
            unique.append(q)
    return unique


def _upsert_candidate(conn: sqlite3.Connection, keyword: str, q: Query, origin: str, settings: dict) -> str | None:
    reason = exclusion_reason(keyword, settings, q.entity, q.category)
    intent = intent_of(keyword, settings.get("autocomplete", {}).get("intent_suffixes", []))
    conn.execute(
        """INSERT INTO candidates(keyword, category, seed, entity, origin, intent, risk, excluded_reason)
           VALUES (?,?,?,?,?,?,?,?)
           ON CONFLICT(keyword) DO UPDATE SET intent=excluded.intent, risk=excluded.risk,
           excluded_reason=excluded.excluded_reason""",
        (keyword, q.category, q.seed, q.entity, origin, intent, int(reason == "risk"), reason),
    )
    return reason


def store(conn: sqlite3.Connection, q: Query, suggestions: list[str], settings: dict) -> dict[str, int]:
    """제안어 저장 + 후보 등록. 시드와 같은 제안어는 버린다. 카테고리는 시드에서 상속."""
    counts = {"kept": 0, "excluded": 0}
    base = squash(q.text)
    with conn:
        if q.origin == "seed" or q.text == q.seed:
            _upsert_candidate(conn, q.seed, q, q.origin, settings)
        rank = 0
        for s in suggestions:
            if squash(s) == base or squash(s) == squash(q.seed):
                continue
            rank += 1
            conn.execute(
                """INSERT INTO autocomplete(seed, suggestion, rank, fetched_at) VALUES (?,?,?,datetime('now'))
                   ON CONFLICT(seed, suggestion) DO UPDATE SET rank=excluded.rank, fetched_at=excluded.fetched_at""",
                (q.text, s, rank),
            )
            if _upsert_candidate(conn, s, q, "autocomplete", settings):
                counts["excluded"] += 1
            else:
                counts["kept"] += 1
    return counts


def refilter(conn: sqlite3.Connection, settings: dict) -> None:
    """설정(리스크·노이즈 사전, 허용 의도)이 바뀌어도 기존 후보에 바로 반영되도록 전체를 다시 판정한다."""
    suffixes = settings.get("autocomplete", {}).get("intent_suffixes", [])
    rows = conn.execute("SELECT keyword, entity, category FROM candidates").fetchall()
    with conn:
        for r in rows:
            reason = exclusion_reason(r["keyword"], settings, r["entity"], r["category"])
            conn.execute(
                "UPDATE candidates SET intent=?, risk=?, excluded_reason=? WHERE keyword=?",
                (intent_of(r["keyword"], suffixes), int(reason == "risk"), reason, r["keyword"]),
            )


def run(cfg: Config, conn: sqlite3.Connection, expand: bool = False,
        session: requests.Session | None = None, sleep=time.sleep) -> dict[str, int]:
    session = session or requests.Session()
    session.headers.setdefault("User-Agent", "Mozilla/5.0 (shortube keyword research)")
    lo, hi = cfg.settings.get("autocomplete", {}).get("sleep_seconds", [0.5, 1.0])
    stats = {"queries": 0, "cached": 0, "failed": 0, "kept": 0, "excluded": 0}
    for q in build_queries(cfg, expand):
        if db.fetched_today(conn, SOURCE, q.text):
            stats["cached"] += 1
            continue
        try:
            suggestions = fetch(session, q.text)
        except Exception as e:  # 형식 변경·차단이 전체 실행을 멈추지 않게
            stats["failed"] += 1
            db.log_fetch(conn, SOURCE, q.text, "failed", str(e)[:200])
            continue
        finally:
            stats["queries"] += 1
            sleep(random.uniform(lo, hi))
        c = store(conn, q, suggestions, cfg.settings)
        stats["kept"] += c["kept"]
        stats["excluded"] += c["excluded"]
        db.log_fetch(conn, SOURCE, q.text, "ok", f"{len(suggestions)} suggestions")
    db.add_usage(conn, SOURCE, stats["queries"])
    refilter(conn, cfg.settings)
    return stats
