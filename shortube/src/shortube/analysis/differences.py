"""'A B 차이' 자동완성 제안어 → 롱폼·쇼츠 주제 후보.

같은 쌍의 표기 변형("열사와 의사 차이", "열사 의사.차이")을 하나로 묶고,
여러 시드에서 반복해서 나오는 주제(=여러 방향에서 검색되는 주제)와 높은 순위에 점수를 준다.
"""

from __future__ import annotations

import csv
import re
import sqlite3
from dataclasses import dataclass, field
from pathlib import Path

DIFF_WORDS = ("차이점", "차이")
SAFE_PARTICLES = ("이랑", "랑", "와", "하고")   # 명사 끝과 헷갈릴 일이 거의 없는 조사
RISKY_PARTICLES = ("과",)                        # '사과', '성형외과' 때문에 따로 처리
STOP_TOKENS = {"vs", "및", "의", "뭐가", "무슨", "설명", "정리", "쉽게", "구분", "구별"}


@dataclass
class Topic:
    key: str
    label: str
    tokens: list[str]
    seeds: set[str] = field(default_factory=set)
    variants: set[str] = field(default_factory=set)
    rank_score: float = 0.0
    done: str | None = None

    @property
    def score(self) -> float:
        return round(len(self.seeds) * 2 + len(self.variants) + self.rank_score, 2)


def tokens_of(suggestion: str, known: set[str]) -> list[str]:
    """'차이' 앞부분만 단어로 나누고 조사를 뗀다."""
    text = suggestion.replace(".", " ").replace(",", " ")
    for w in DIFF_WORDS:
        i = text.find(w)
        if i >= 0:
            text = text[:i]
            break
    out = []
    for t in text.split():
        t = t.strip().lower()
        for p in SAFE_PARTICLES:
            if t.endswith(p) and len(t) - len(p) >= 2:
                t = t[: -len(p)]
                break
        else:
            for p in RISKY_PARTICLES:
                if t.endswith(p) and t[: -len(p)] in known:
                    t = t[: -len(p)]
        if t and t not in STOP_TOKENS:
            out.append(t)
    return out


def done_label(tokens: list[str], done_topics: list[list[str]]) -> str | None:
    """이미 만든 편과 단어가 2개 이상 겹치면 그 편 이름."""
    s = set(tokens)
    for words in done_topics:
        if len(s & set(words)) >= 2:
            return " · ".join(words)
    return None


def build_topics(rows: list[sqlite3.Row], done_topics: list[list[str]]) -> list[Topic]:
    seeds_words = {r["seed"].replace(" 차이", "").strip().lower() for r in rows}
    known = set(seeds_words)
    for r in rows:
        known.update(t.lower() for t in re.split(r"\s+", r["keyword"]))
    topics: dict[str, Topic] = {}
    for r in rows:
        toks = tokens_of(r["keyword"], known)
        if len(toks) < 2:            # 'A 차이'처럼 쌍이 아닌 것은 주제가 안 됨
            continue
        key = "|".join(sorted(set(toks)))
        t = topics.get(key)
        if t is None:
            t = topics[key] = Topic(key=key, label=" vs ".join(toks), tokens=toks,
                                    done=done_label(toks, done_topics))
        t.seeds.add(r["seed"])
        t.variants.add(r["keyword"])
        t.rank_score += 1.0 / max(int(r["rank"] or 10), 1)
    return sorted(topics.values(), key=lambda t: (-t.score, t.label))


def load_rows(conn: sqlite3.Connection, category: str = "difference") -> list[sqlite3.Row]:
    return conn.execute(
        """SELECT c.keyword, c.seed, MIN(a.rank) AS rank
           FROM candidates c LEFT JOIN autocomplete a ON a.suggestion = c.keyword
           WHERE c.category = ? AND c.origin = 'autocomplete' AND c.excluded_reason IS NULL
           GROUP BY c.keyword, c.seed""",
        (category,),
    ).fetchall()


def write_csv(path: Path, topics: list[Topic]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["topic", "score", "seed_count", "variant_count", "done_episode", "seeds", "variants"])
        for t in topics:
            w.writerow([t.label, t.score, len(t.seeds), len(t.variants), t.done or "",
                        "; ".join(sorted(t.seeds)), "; ".join(sorted(t.variants))])
