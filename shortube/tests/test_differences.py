from shortube import db
from shortube.analysis import differences as dif
from shortube.analysis.filters import exclusion_reason

KNOWN = {"생크림", "우유", "의사", "열사", "사과", "성형외과"}


def test_tokens_strip_particles_safely():
    assert dif.tokens_of("생크림과 우유 차이", KNOWN) == ["생크림", "우유"]
    assert dif.tokens_of("열사와 의사 차이", KNOWN) == ["열사", "의사"]
    assert dif.tokens_of("열사 의사.차이", KNOWN) == ["열사", "의사"]
    assert dif.tokens_of("사과 배 차이", KNOWN) == ["사과", "배"]          # '사과'의 '과'는 조사 아님
    assert dif.tokens_of("성형외과 피부과 차이점", KNOWN) == ["성형외과", "피부과"]
    assert dif.tokens_of("바리스타 우유 차이점 설명", KNOWN) == ["바리스타", "우유"]


def test_required_intent_for_difference_category():
    settings = {"category_required_intents": {"difference": ["차이"]}}
    assert exclusion_reason("우유 두유 차이", settings, category="difference") is None
    assert exclusion_reason("우유 다이어트", settings, category="difference") == "off_whitelist"
    assert exclusion_reason("우유 다이어트", settings, category="trivia") is None


def test_build_topics_merges_variants_and_marks_done(tmp_path):
    conn = db.connect(tmp_path / "t.db")
    rows = [
        ("열사와 의사 차이", "의사 차이", 1),
        ("열사 의사.차이", "열사 차이", 2),
        ("의사 약사 차이", "의사 차이", 3),
        ("간호사 의사 약사 차이", "약사 차이", 1),
        ("우유 차이", "우유 차이", 1),                 # 쌍이 아님 → 제외
    ]
    with conn:
        for kw, seed, rank in rows:
            conn.execute("INSERT INTO candidates(keyword, category, seed, origin) VALUES (?, 'difference', ?, 'autocomplete')",
                         (kw, seed))
            conn.execute("INSERT INTO autocomplete(seed, suggestion, rank, fetched_at) VALUES (?,?,?,'x')", (seed, kw, rank))
    topics = dif.build_topics(dif.load_rows(conn), [["의사", "약사", "간호사"]])
    by_key = {t.key: t for t in topics}
    assert set(by_key) == {"열사|의사", "약사|의사", "간호사|약사|의사"}
    assert len(by_key["열사|의사"].seeds) == 2 and len(by_key["열사|의사"].variants) == 2
    assert topics[0].key == "열사|의사"                          # 시드 2곳에서 나와 최상위
    assert by_key["간호사|약사|의사"].done == "의사 · 약사 · 간호사"
    assert by_key["약사|의사"].done == "의사 · 약사 · 간호사"
