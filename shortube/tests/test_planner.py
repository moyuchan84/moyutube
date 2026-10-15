import random
from datetime import date, timedelta

from shortube import db
from shortube.analysis import planner

ROT = {"rotation": {"weights": {"trivia": 0.5, "explain": 0.3, "chart": 0.2}, "max_streak": 2,
                    "weekly_caps": {"chart": 2}, "keyword_cooldown_days": 60, "entity_cooldown_days": 3}}
TODAY = date(2026, 10, 15)


def seed_db(tmp_path):
    conn = db.connect(tmp_path / "t.db")
    rows = [
        ("하는 이유", "trivia", None, "이유", "seed"),
        ("딸꾹질 하는 이유", "trivia", None, "이유", "autocomplete"),
        ("하품 하는 이유", "trivia", None, "이유", "autocomplete"),
        ("넷플릭스 순위 그래프", "chart", None, "순위", "autocomplete"),
        ("나를 충전해줘 원작", "explain", "나를 충전해줘", "원작", "template"),
        ("나를 충전해줘 몇 부작", "explain", "나를 충전해줘", "몇 부작", "template"),
        ("나를 충전해줘", "explain", "나를 충전해줘", None, "template"),
        ("메리 베리 러브 원작", "explain", "메리 베리 러브", "원작", "template"),
    ]
    with conn:
        conn.executemany("INSERT INTO candidates(keyword, category, entity, intent, origin) VALUES (?,?,?,?,?)", rows)
        conn.execute("INSERT INTO candidates(keyword, category, origin, excluded_reason) VALUES ('가수 근황 이유','trivia','autocomplete','risk')")
        conn.execute("INSERT INTO ott_works(title_en, ko_title, first_aired, fetched_at) VALUES ('A','나를 충전해줘','2026-10-09','x')")
        conn.execute("INSERT INTO ott_works(title_en, ko_title, first_aired, fetched_at) VALUES ('B','메리 베리 러브','2026-10-07','x')")
    return conn


def test_choose_categories_rules():
    rng = random.Random(1)
    rot = ROT["rotation"]
    for _ in range(50):
        picked = planner.choose_categories(["trivia", "trivia"], {}, ["trivia", "explain", "chart"], rot, 2, rng)
        assert picked[0] != "trivia"                      # 연속 2회 뒤에는 다른 카테고리
        assert len(set(picked)) == 2                      # 같은 날 중복 없음
        capped = planner.choose_categories([], {"chart": 2}, ["trivia", "chart"], rot, 1, rng)
        assert capped == ["trivia"]                       # 주간 상한


def test_plan_shortlists_and_is_deterministic(tmp_path):
    conn = seed_db(tmp_path)
    ents = ["나를 충전해줘", "메리 베리 러브"]
    a = planner.plan(conn, ROT, ents, TODAY, 2)
    b = planner.plan(conn, ROT, ents, TODAY, 2)
    assert [(s.category, [c["keyword"] for c in s.shortlist]) for s in a] == \
           [(s.category, [c["keyword"] for c in s.shortlist]) for s in b]
    for s in a:
        kws = {c["keyword"] for c in s.shortlist}
        assert "하는 이유" not in kws and "가수 근황 이유" not in kws and "나를 충전해줘" not in kws
        if s.category == "explain":
            assert s.entity == "나를 충전해줘"                # 최신 공개작 우선
            assert kws == {"나를 충전해줘 원작", "나를 충전해줘 몇 부작"}


def test_cooldowns_and_daily_count(tmp_path):
    conn = seed_db(tmp_path)
    ents = ["나를 충전해줘", "메리 베리 러브"]
    planner.record(conn, TODAY - timedelta(days=1), "explain", "나를 충전해줘 원작", "나를 충전해줘", "원작")
    planner.record(conn, TODAY - timedelta(days=2), "trivia", "딸꾹질 하는 이유", None, "이유")
    assert planner.entity_pool(conn, TODAY, 3, ents) == ["메리 베리 러브"]
    trivia = [c["keyword"] for c in planner.candidates(conn, "trivia", TODAY, 60)]
    assert trivia == ["하품 하는 이유"]

    planner.record(conn, TODAY, "trivia", "하품 하는 이유", None, "이유")
    slots = planner.plan(conn, ROT, ents, TODAY, 2)
    assert len(slots) == 1 and slots[0].slot == 2 and slots[0].category != "trivia"
    assert planner.plan(conn, ROT, ents, TODAY, 1) == []
