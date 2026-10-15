"""모듈 1a: 최근 OTT 오리지널 작품 자동 수집.

출처: 영문 위키백과 "{year} in South Korean television"의 'New series and returning shows' 표.
작품명·플랫폼·공개일(사실 정보)만 추출하고, 한국어 제목은 위키 언어 링크 → 본문 {{Korean|..}} → 인포박스 hangul= 순서로 찾는다.
결과는 config/entities_auto.yaml로 써서 사람이 use 값을 확인·수정한 뒤 키워드 조합에 쓴다.
"""

from __future__ import annotations

import logging
import re
import sqlite3
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

import yaml

from shortube.collectors.wiki import WikiClient

log = logging.getLogger(__name__)

PAGE_TEMPLATE = "{year} in South Korean television"
SECTION = "New series and returning shows"
SOURCE = "wiki_ott"


@dataclass
class Work:
    title_en: str
    article: str | None
    platforms: list[str]
    first_aired: date | None
    ko_title: str | None = None


# ---------- wikitext 파싱 ----------

def split_top_level(text: str, sep: str = "|") -> list[str]:
    """[[..]], {{..}} 안의 구분자는 무시하고 나눈다."""
    parts, depth, buf, i = [], 0, [], 0
    while i < len(text):
        two = text[i:i + 2]
        if two in ("[[", "{{"):
            depth += 1
            buf.append(two)
            i += 2
            continue
        if two in ("]]", "}}"):
            depth = max(depth - 1, 0)
            buf.append(two)
            i += 2
            continue
        if text.startswith(sep, i) and depth == 0:
            parts.append("".join(buf))
            buf = []
            i += len(sep)
            continue
        buf.append(text[i])
        i += 1
    parts.append("".join(buf))
    return parts


def _cell(raw: str) -> tuple[str, int]:
    """셀 속성(style=, colspan= 등)을 떼고 (내용, colspan)을 돌려준다."""
    parts = split_top_level(raw)
    content, attrs = parts[-1], " ".join(parts[:-1]) if len(parts) > 1 else ""
    if len(parts) > 1 and "=" not in parts[0]:
        content, attrs = raw, ""  # 속성이 아니라 내용 안의 파이프
    m = re.search(r'colspan\s*=\s*"?(\d+)', attrs)
    return content.strip(), int(m.group(1)) if m else 1


def extract_table(wikitext: str, section: str = SECTION) -> str | None:
    m = re.search(r"^==\s*" + re.escape(section) + r"\s*==\s*$", wikitext, re.M)
    if not m:
        return None
    start = wikitext.find("{|", m.end())
    end = wikitext.find("\n|}", start)
    if start < 0 or end < 0:
        return None
    return wikitext[start:end]


def parse_table(table: str) -> list[dict[str, str]]:
    headers: list[str] = []
    rows: list[dict[str, str]] = []
    for block in re.split(r"^\|-.*$", table, flags=re.M):
        cells: list[str] = []
        for line in block.splitlines():
            if line.startswith("!"):
                for h in split_top_level(line[1:], "!!"):
                    headers.append(_cell(h)[0])
            elif line.startswith("|") and not line.startswith(("|}", "|-", "|+")):
                for c in split_top_level(line[1:], "||"):
                    content, span = _cell(c)
                    cells.extend([content] * span)
        if cells and headers:
            rows.append(dict(zip(headers, cells)))
    return rows


LINK = re.compile(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]")


def parse_title(cell: str) -> tuple[str, str | None]:
    cell = re.sub(r"\{\{Efn[^}]*\}\}", "", cell, flags=re.I)
    m = LINK.search(cell)
    if m:
        return (m.group(2) or m.group(1)).strip(), m.group(1).strip()
    return re.sub(r"'{2,}|\{\{[^}]*\}\}", "", cell).strip(), None


def parse_platforms(cell: str) -> list[str]:
    text = LINK.sub(lambda m: m.group(2) or m.group(1), cell)
    return [p.strip() for p in text.split("/") if p.strip()]


DATE_TPL = re.compile(r"\{\{dtsi?\|([^}]*)\}\}", re.I)


def parse_date(cell: str, year: int) -> date | None:
    m = DATE_TPL.search(cell)
    raw = (m.group(1) if m else cell).strip()
    if not raw:
        return None
    parts = [p.strip() for p in raw.split("|") if p.strip() and "=" not in p]
    if len(parts) == 3 and all(p.isdigit() for p in parts):
        return date(int(parts[0]), int(parts[1]), int(parts[2]))
    text = parts[0] if parts else raw
    for fmt, has_year in (("%B %d, %Y", True), ("%B %d %Y", True), ("%B %d", False)):
        try:
            d = datetime.strptime(text, fmt).date()
            return d if has_year else d.replace(year=year)
        except ValueError:
            continue
    return None


def parse_works(wikitext: str, year: int) -> list[Work]:
    table = extract_table(wikitext)
    if table is None:
        raise ValueError(f"'{SECTION}' 표를 찾지 못했습니다 (문서 형식 변경 가능성)")
    works = []
    for row in parse_table(table):
        title_cell = row.get("Title")
        if not title_cell:
            continue
        title, article = parse_title(title_cell)
        works.append(Work(
            title_en=title,
            article=article,
            platforms=parse_platforms(row.get("Channel/Platform", "")),
            first_aired=parse_date(row.get("First Aired", ""), year),
        ))
    return works


def filter_works(works: list[Work], platforms: list[str], start: date, end: date) -> list[Work]:
    wanted = {p.lower() for p in platforms}
    return [
        w for w in works
        if w.first_aired and start <= w.first_aired <= end
        and any(p.lower() in wanted for p in w.platforms)
    ]


KOREAN_TPL = re.compile(r"\{\{Korean\|(?:hangul=)?([^|}]+)", re.I)
HANGUL_FIELD = re.compile(r"hangul\s*=\s*([^|}\n]+)", re.I)
HAS_HANGUL = re.compile(r"[가-힣]")


def clean_ko_title(title: str) -> str:
    title = re.sub(r"\s*\([^)]*\)\s*$", "", title)   # "작품 (드라마)" 같은 구분자 제거
    return title.replace("^", "").replace("_", " ").strip()


def find_hangul(article_wikitext: str) -> str | None:
    for pattern in (KOREAN_TPL, HANGUL_FIELD):
        m = pattern.search(article_wikitext)
        if m and HAS_HANGUL.search(m.group(1)):
            return clean_ko_title(m.group(1))
    return None


# ---------- 수집 / 저장 ----------

def resolve_korean_titles(client: WikiClient, works: list[Work]) -> None:
    articles = [w.article for w in works if w.article]
    links = client.langlinks(articles, "ko") if articles else {}
    for w in works:
        if w.article and w.article in links:
            w.ko_title = clean_ko_title(links[w.article])
            continue
        if w.article:
            page = client.page_wikitext(w.article)
            if page:
                w.ko_title = find_hangul(page[0])
        if not w.ko_title:
            log.warning("한국어 제목을 찾지 못했습니다: %s", w.title_en)


def collect(client: WikiClient, today: date, lookback_days: int, platforms: list[str]) -> tuple[list[Work], list[dict]]:
    start = today - timedelta(days=lookback_days)
    works: list[Work] = []
    pages: list[dict] = []
    for year in sorted({start.year, today.year}):
        title = PAGE_TEMPLATE.format(year=year)
        page = client.page_wikitext(title)
        if page is None:
            log.warning("위키 문서가 없습니다: %s", title)
            continue
        text, revid = page
        pages.append({"title": title, "revid": revid,
                      "url": "https://en.wikipedia.org/wiki/" + title.replace(" ", "_")})
        works.extend(parse_works(text, year))
    selected = filter_works(works, platforms, start, today)
    resolve_korean_titles(client, selected)
    return selected, pages


def save_db(conn: sqlite3.Connection, works: list[Work], pages: list[dict]) -> None:
    source = ", ".join(f"{p['title']}@{p['revid']}" for p in pages)
    with conn:
        for w in works:
            conn.execute(
                """INSERT INTO ott_works(title_en, ko_title, platform, first_aired, article, source, fetched_at)
                   VALUES (?,?,?,?,?,?,datetime('now'))
                   ON CONFLICT(title_en) DO UPDATE SET ko_title=excluded.ko_title, platform=excluded.platform,
                   first_aired=excluded.first_aired, article=excluded.article, source=excluded.source,
                   fetched_at=excluded.fetched_at""",
                (w.title_en, w.ko_title, "/".join(w.platforms), w.first_aired.isoformat(), w.article, source),
            )


def write_yaml(path: Path, works: list[Work], pages: list[dict], start: date, end: date) -> None:
    previous: dict[str, Any] = {}
    if path.exists():
        old = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        previous = {w.get("title_en"): w for w in old.get("works", [])}
    items = []
    for w in sorted(works, key=lambda x: x.first_aired or date.min):
        kept = previous.get(w.title_en, {})
        # 사람이 직접 채운 name, 바꾼 use 값은 재실행해도 유지. 한국어 제목이 없으면 기본 제외.
        name = w.ko_title or kept.get("name")
        items.append({
            "name": name,
            "title_en": w.title_en,
            "platform": "/".join(w.platforms),
            "first_aired": w.first_aired.isoformat() if w.first_aired else None,
            "use": bool(kept.get("use", True)) if name else False,
        })
    header = (
        "# 자동 생성 파일: python -m shortube entities\n"
        "# use: false로 바꾸면 키워드 조합에서 빠집니다. 재실행해도 use 값은 유지됩니다.\n"
        "# name이 비어 있으면(한국어 제목 미확인) 직접 채우고 use: true로 바꾸세요.\n"
    )
    body = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "window": {"from": start.isoformat(), "to": end.isoformat()},
        "sources": pages,
        "works": items,
    }
    path.write_text(header + yaml.safe_dump(body, allow_unicode=True, sort_keys=False), encoding="utf-8")
