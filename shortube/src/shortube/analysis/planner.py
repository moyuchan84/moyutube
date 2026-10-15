"""일일 주제 선정 (로테이션 전략).

- 카테고리: 가중치 랜덤 + 규칙(연속 제한, 주간 상한, 같은 날 중복 금지, 후보 없는 카테고리 제외)
- 카테고리 안: 최근에 쓴 키워드·작품은 쿨다운, 작품형은 최신 공개작 우선
- 같은 날 다시 돌려도 같은 결과가 나오도록 날짜를 시드로 쓴다.
"""

from __future__ import annotations

import random
import sqlite3
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Any

ENTITY_CATEGORY = "explain"


@dataclass
class Slot:
    slot: int
    category: str
    entity: str | None = None
    shortlist: list[dict[str, Any]] = field(default_factory=list)


def history(conn: sqlite3.Connection, since: date) -> list[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM topic_history WHERE date >= ? ORDER BY date, slot", (since.isoformat(),)
    ).fetchall()


def _recent(conn: sqlite3.Connection, column: str, today: date, days: int) -> set[str]:
    since = (today - timedelta(days=days)).isoformat()
    return {r[0] for r in conn.execute(
        f"SELECT {column} FROM topic_history WHERE date >= ? AND {column} IS NOT NULL", (since,))}


def entity_pool(conn: sqlite3.Connection, today: date, cooldown_days: int, entities: list[str]) -> list[str]:
    """쿨다운이 아닌 작품을 최신 공개순으로."""
    used = _recent(conn, "entity", today, cooldown_days)
    aired = {r["ko_title"]: r["first_aired"] or "" for r in conn.execute("SELECT ko_title, first_aired FROM ott_works")}
    pool = [e for e in entities if e not in used]
    return sorted(pool, key=lambda e: aired.get(e, ""), reverse=True)


def candidates(conn: sqlite3.Connection, category: str, today: date, cooldown_days: int,
               entity: str | None = None) -> list[dict[str, Any]]:
    """통과한 후보 중 구체적인 주제만. 시드 자체("하는 이유" 등)는 너무 포괄적이라 뺀다."""
    used = _recent(conn, "keyword", today, cooldown_days)
    sql = "SELECT keyword, category, entity, intent, origin FROM candidates WHERE excluded_reason IS NULL AND category=?"
    args: list[Any] = [category]
    if entity:
        sql += " AND entity=? AND intent IS NOT NULL"
        args.append(entity)
    else:
        sql += " AND origin='autocomplete'"
    return [dict(r) for r in conn.execute(sql, args) if r["keyword"] not in used]


def choose_categories(recent: list[str], week_counts: dict[str, int], available: list[str],
                      settings: dict[str, Any], n: int, rng: random.Random) -> list[str]:
    weights: dict[str, float] = settings.get("weights", {})
    max_streak = int(settings.get("max_streak", 2))
    caps: dict[str, int] = settings.get("weekly_caps", {})
    picked: list[str] = []
    for _ in range(n):
        seq = recent + picked
        allowed = []
        for c in available:
            if c in picked:                                          # 같은 날 두 슬롯은 다른 카테고리
                continue
            if len(seq) >= max_streak and all(x == c for x in seq[-max_streak:]):
                continue
            if c in caps and week_counts.get(c, 0) + picked.count(c) >= caps[c]:
                continue
            if weights.get(c, 0) > 0:
                allowed.append(c)
        if not allowed:                                              # 규칙을 다 지킬 수 없으면 가용 카테고리 중 아직 안 고른 것
            allowed = [c for c in available if c not in picked and weights.get(c, 0) > 0]
        if not allowed:
            break
        picked.append(rng.choices(allowed, weights=[weights[c] for c in allowed])[0])
    return picked


def plan(conn: sqlite3.Connection, settings: dict[str, Any], entities: list[str], today: date,
         count: int, shortlist_size: int = 5) -> list[Slot]:
    rot = settings.get("rotation", {})
    rng = random.Random(f"shortube-{today.isoformat()}")
    kw_cool = int(rot.get("keyword_cooldown_days", 60))
    ent_cool = int(rot.get("entity_cooldown_days", 3))
    done_today = [r for r in history(conn, today) if r["date"] == today.isoformat()]
    remaining = max(count - len(done_today), 0)

    available = []
    for cat in rot.get("weights", {}):
        if cat == ENTITY_CATEGORY:
            if any(candidates(conn, cat, today, kw_cool, e) for e in entity_pool(conn, today, ent_cool, entities)):
                available.append(cat)
        elif candidates(conn, cat, today, kw_cool):
            available.append(cat)

    past = history(conn, today - timedelta(days=30))
    recent = [r["category"] for r in past]
    week_since = (today - timedelta(days=6)).isoformat()
    week_counts: dict[str, int] = {}
    for r in past:
        if r["date"] >= week_since:
            week_counts[r["category"]] = week_counts.get(r["category"], 0) + 1

    slots = []
    for i, cat in enumerate(choose_categories(recent, week_counts, available, rot, remaining, rng)):
        slot = Slot(slot=len(done_today) + i + 1, category=cat)
        if cat == ENTITY_CATEGORY:
            for e in entity_pool(conn, today, ent_cool, entities):
                pool = candidates(conn, cat, today, kw_cool, e)
                if pool:
                    slot.entity = e
                    slot.shortlist = pool                            # 한 작품의 사실형 의도를 모두 넘긴다 (한 영상에 묶기)
                    break
        else:
            pool = candidates(conn, cat, today, kw_cool)
            rng.shuffle(pool)
            slot.shortlist = pool[:shortlist_size]
        slots.append(slot)
    return slots


def record(conn: sqlite3.Connection, today: date, category: str, keyword: str,
           entity: str | None, intent: str | None, brief: str | None = None) -> int:
    with conn:
        n = conn.execute("SELECT COUNT(*) FROM topic_history WHERE date=?", (today.isoformat(),)).fetchone()[0]
        conn.execute(
            "INSERT INTO topic_history(date, slot, category, keyword, entity, intent, brief) VALUES (?,?,?,?,?,?,?)",
            (today.isoformat(), n + 1, category, keyword, entity, intent, brief),
        )
    return n + 1
