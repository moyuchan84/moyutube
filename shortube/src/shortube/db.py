"""SQLite 스키마와 연결."""

from __future__ import annotations

import sqlite3
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS candidates (
    keyword         TEXT PRIMARY KEY,
    category        TEXT NOT NULL,
    seed            TEXT,
    entity          TEXT,
    origin          TEXT NOT NULL,          -- seed | template | autocomplete | wiki_top
    intent          TEXT,
    risk            INTEGER NOT NULL DEFAULT 0,
    excluded_reason TEXT,                   -- risk | advice | person | NULL
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- (source, keyword, 날짜) 단위 수집 이력: 같은 날 재호출 방지
CREATE TABLE IF NOT EXISTS fetch_log (
    source       TEXT NOT NULL,
    keyword      TEXT NOT NULL,
    fetched_date TEXT NOT NULL,
    status       TEXT NOT NULL,             -- ok | failed | skipped
    detail       TEXT,
    PRIMARY KEY (source, keyword, fetched_date)
);

-- 외부 호출 사용량 (YouTube 쿼터 units, 네이버 호출 수 등)
CREATE TABLE IF NOT EXISTS api_usage (
    source TEXT NOT NULL,
    date   TEXT NOT NULL,
    units  INTEGER NOT NULL DEFAULT 0,
    calls  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (source, date)
);

CREATE TABLE IF NOT EXISTS trend_points (
    keyword    TEXT NOT NULL,
    source     TEXT NOT NULL,               -- naver | google | wiki
    date       TEXT NOT NULL,
    ratio_raw  REAL,
    ratio_norm REAL,
    fetched_at TEXT NOT NULL,
    PRIMARY KEY (keyword, source, date)
);

CREATE TABLE IF NOT EXISTS related_queries (
    keyword    TEXT NOT NULL,
    source     TEXT NOT NULL,
    kind       TEXT NOT NULL,               -- top | rising
    query      TEXT NOT NULL,
    value      REAL,
    fetched_at TEXT NOT NULL,
    PRIMARY KEY (keyword, source, kind, query)
);

CREATE TABLE IF NOT EXISTS autocomplete (
    seed       TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    rank       INTEGER NOT NULL,
    fetched_at TEXT NOT NULL,
    PRIMARY KEY (seed, suggestion)
);

CREATE TABLE IF NOT EXISTS videos (
    video_id     TEXT NOT NULL,
    keyword      TEXT NOT NULL,
    title        TEXT,
    channel_id   TEXT,
    published_at TEXT,
    duration_s   INTEGER,
    views        INTEGER,
    likes        INTEGER,
    comments     INTEGER,
    tags         TEXT,
    has_shorts_tag INTEGER,
    fetched_at   TEXT NOT NULL,
    PRIMARY KEY (video_id, keyword)
);

CREATE TABLE IF NOT EXISTS channels (
    channel_id  TEXT PRIMARY KEY,
    title       TEXT,
    subscribers INTEGER,
    fetched_at  TEXT NOT NULL
);

-- 최근 공개된 OTT 오리지널 작품 (모듈 1a)
CREATE TABLE IF NOT EXISTS ott_works (
    title_en    TEXT PRIMARY KEY,
    ko_title    TEXT,
    platform    TEXT,
    first_aired TEXT,
    article     TEXT,
    source      TEXT,                       -- 위키 문서@revid
    fetched_at  TEXT NOT NULL
);

-- 일일 주제 선정 이력 (로테이션·쿨다운 판단용)
CREATE TABLE IF NOT EXISTS topic_history (
    date     TEXT NOT NULL,
    slot     INTEGER NOT NULL,
    category TEXT NOT NULL,
    keyword  TEXT NOT NULL,
    entity   TEXT,
    intent   TEXT,
    brief    TEXT,                          -- 제작 브리프 파일 경로
    PRIMARY KEY (date, slot)
);

CREATE TABLE IF NOT EXISTS source_checks (
    keyword             TEXT PRIMARY KEY,
    has_wiki            INTEGER,
    official_count      INTEGER,
    independent_count   INTEGER,
    source_availability REAL,
    top_urls            TEXT,               -- JSON 배열
    fetched_at          TEXT NOT NULL
);
"""


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(SCHEMA)
    return conn


def fetched_today(conn: sqlite3.Connection, source: str, keyword: str) -> bool:
    row = conn.execute(
        "SELECT 1 FROM fetch_log WHERE source=? AND keyword=? AND fetched_date=date('now','localtime') AND status='ok'",
        (source, keyword),
    ).fetchone()
    return row is not None


def log_fetch(conn: sqlite3.Connection, source: str, keyword: str, status: str, detail: str | None = None) -> None:
    with conn:
        conn.execute(
            """INSERT INTO fetch_log(source, keyword, fetched_date, status, detail)
               VALUES (?,?,date('now','localtime'),?,?)
               ON CONFLICT(source, keyword, fetched_date) DO UPDATE SET status=excluded.status, detail=excluded.detail""",
            (source, keyword, status, detail),
        )


def add_usage(conn: sqlite3.Connection, source: str, calls: int, units: int = 0) -> None:
    with conn:
        conn.execute(
            """INSERT INTO api_usage(source, date, units, calls) VALUES (?,date('now','localtime'),?,?)
               ON CONFLICT(source, date) DO UPDATE SET units=units+excluded.units, calls=calls+excluded.calls""",
            (source, units, calls),
        )


def prune_youtube(conn: sqlite3.Connection, retention_days: int) -> tuple[int, int]:
    """보관 기한이 지난 YouTube API 데이터를 삭제한다. (videos, channels) 삭제 행 수를 반환."""
    cutoff = f"-{int(retention_days)} days"
    with conn:
        v = conn.execute("DELETE FROM videos WHERE fetched_at < datetime('now', ?)", (cutoff,)).rowcount
        c = conn.execute("DELETE FROM channels WHERE fetched_at < datetime('now', ?)", (cutoff,)).rowcount
    return v, c
