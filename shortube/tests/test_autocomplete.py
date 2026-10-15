import json

import pytest

from shortube import db
from shortube.analysis.filters import exclusion_reason, intent_of
from shortube.collectors import autocomplete as ac
from shortube.config import Category, Config, Entity

SETTINGS = {
    "risk_words": ["근황", "논란", "열애", "사망"],
    "advice_patterns": ["하면 낫", "사면 오른"],
    "noise_words": ["광고없", "틀어"],
    "entity_allowed_intents": ["몇 부작", "몇부작", "원작", "공개일", "촬영지"],
    "entity_categories": ["explain"],
    "autocomplete": {"sleep_seconds": [0, 0], "intent_suffixes": ["이유", "순위", "몇 부작", "원작"]},
}


def make_cfg(tmp_path, entities=()):
    return Config(
        root=tmp_path,
        categories={
            "trivia": Category("trivia", True, ["하는 이유"]),
            "explain": Category("explain", True, ["몇 부작"]),
            "career": Category("career", False, ["필모그래피"]),
        },
        settings=SETTINGS,
        sources={},
        entities=[Entity(n, t) for n, t in entities],
    )


def test_parse_response_ok_and_bad():
    raw = json.dumps(["q", ["a", " b ", ""], [], {}], ensure_ascii=False).encode("utf-8")
    assert ac.parse_response(raw) == ["a", "b"]
    with pytest.raises(ValueError):
        ac.parse_response(b'{"unexpected": 1}')


def test_intent_longest_match():
    assert intent_of("나를 충전해줘 몇부작", ["몇부작", "부작"]) == "몇부작"
    assert intent_of("하품 하는 이유", ["이유", "순위"]) == "이유"
    assert intent_of("아무거나", ["이유"]) is None


@pytest.mark.parametrize("kw,entity,reason", [
    ("배우 근황", None, "risk"),
    ("열 애 설", None, "risk"),               # 띄어쓰기로 리스크 단어를 피하지 못함
    ("열애 인정", None, "risk"),
    ("이거 하면 낫는다", None, "advice"),
    ("하품 하는 이유", None, None),
    ("멜론 차트 100 광고 없음", None, "noise"),
    ("나를 충전해줘 원작", "나를 충전해줘", None),
    ("나를 충전해줘 몇 부작", "나를 충전해줘", None),
    ("나를 충전해줘 키스신", "나를 충전해줘", "off_whitelist"),
    ("나를 충전해줘 차우민", "나를 충전해줘", "off_whitelist"),  # 인물명 등 허용 의도 없는 것
])
def test_exclusion_reason(kw, entity, reason):
    assert exclusion_reason(kw, SETTINGS, entity) == reason


def test_build_queries(tmp_path):
    cfg = make_cfg(tmp_path, [("나를 충전해줘", "work"), ("홍길동", "person")])
    texts = [q.text for q in ac.build_queries(cfg)]
    assert texts == ["하는 이유", "나를 충전해줘", "나를 충전해줘 몇 부작"]   # career 비활성, 인물 제외
    expanded = ac.build_queries(cfg, expand=True)
    assert len(expanded) == 3 + 3 * 14
    assert expanded[3].text == "하는 이유 ㄱ" and expanded[3].category == "trivia"


def test_build_queries_skips_entity_category_without_entities(tmp_path):
    texts = [q.text for q in ac.build_queries(make_cfg(tmp_path))]
    assert texts == ["하는 이유"]


class FakeResp:
    def __init__(self, items):
        self.content = json.dumps(["q", items], ensure_ascii=False).encode("utf-8")

    def raise_for_status(self):
        pass


class FakeSession:
    headers: dict = {}

    def __init__(self):
        self.calls = 0

    def get(self, url, params, timeout):
        self.calls += 1
        q = params["q"]
        if q == "나를 충전해줘":
            return FakeResp(["나를 충전해줘", "나를 충전해줘 원작", "나를 충전해줘 키스신"])
        if q == "하는 이유":
            return FakeResp(["하는 이유", "하품 하는 이유", "가수 근황 이유"])
        return FakeResp([])


def test_run_stores_filters_and_caches(tmp_path):
    cfg = make_cfg(tmp_path, [("나를 충전해줘", "work")])
    conn = db.connect(tmp_path / "t.db")
    session = FakeSession()
    stats = ac.run(cfg, conn, session=session, sleep=lambda s: None)
    assert stats["queries"] == 3 and stats["kept"] == 2 and stats["excluded"] == 2

    rows = {r["keyword"]: dict(r) for r in conn.execute("SELECT * FROM candidates")}
    assert rows["하품 하는 이유"]["category"] == "trivia" and rows["하품 하는 이유"]["excluded_reason"] is None
    assert rows["가수 근황 이유"]["excluded_reason"] == "risk" and rows["가수 근황 이유"]["risk"] == 1
    assert rows["나를 충전해줘 원작"]["category"] == "explain"
    assert rows["나를 충전해줘 키스신"]["excluded_reason"] == "off_whitelist"
    assert "하는 이유" in rows                              # 시드 자체도 후보
    ranks = conn.execute("SELECT suggestion, rank FROM autocomplete WHERE seed='하는 이유' ORDER BY rank").fetchall()
    assert [tuple(r) for r in ranks] == [("하품 하는 이유", 1), ("가수 근황 이유", 2)]

    again = ac.run(cfg, conn, session=session, sleep=lambda s: None)
    assert again["queries"] == 0 and again["cached"] == 3 and session.calls == 3


def test_run_survives_bad_response(tmp_path):
    class Broken(FakeSession):
        def get(self, url, params, timeout):
            r = FakeResp([])
            r.content = b"<html>blocked</html>"
            return r

    conn = db.connect(tmp_path / "t.db")
    stats = ac.run(make_cfg(tmp_path), conn, session=Broken(), sleep=lambda s: None)
    assert stats["failed"] == 1
    assert conn.execute("SELECT status FROM fetch_log").fetchone()[0] == "failed"
