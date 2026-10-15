import logging
from pathlib import Path

import pytest

from shortube import db
from shortube.config import ConfigError, load_config, parse_entities, parse_seeds, require_env


def test_load_real_config():
    cfg = load_config()
    names = {c.name for c in cfg.enabled_categories()}
    assert names == {"difference"}                     # 모라구 프로필
    assert cfg.categories["difference"].suffix == " 차이"
    assert cfg.categories["career"].enabled is False
    weights = cfg.settings["scoring"]["weights"]
    assert sum(weights.values()) == pytest.approx(1.0)


def test_parse_seeds_rejects_flat_list():
    with pytest.raises(ConfigError):
        parse_seeds({"chart": ["멜론 차트"]})


def test_person_entity_warns_and_is_not_work(caplog):
    with caplog.at_level(logging.WARNING):
        entities = parse_entities([
            {"name": "오징어 게임", "entity_type": "work"},
            {"name": "홍길동", "entity_type": "person"},
        ])
    assert [e.name for e in entities if e.entity_type == "work"] == ["오징어 게임"]
    assert "홍길동" in caplog.text


def test_entity_type_required():
    with pytest.raises(ConfigError):
        parse_entities([{"name": "무언가"}])


def test_require_env_missing(monkeypatch):
    monkeypatch.delenv("YOUTUBE_API_KEY", raising=False)
    with pytest.raises(ConfigError, match="YOUTUBE_API_KEY"):
        require_env("YOUTUBE_API_KEY")


def test_schema_and_prune(tmp_path: Path):
    conn = db.connect(tmp_path / "t.db")
    conn.execute("INSERT INTO videos(video_id, keyword, fetched_at) VALUES ('old','k', datetime('now','-40 days'))")
    conn.execute("INSERT INTO videos(video_id, keyword, fetched_at) VALUES ('new','k', datetime('now'))")
    conn.execute("INSERT INTO channels(channel_id, fetched_at) VALUES ('c1', datetime('now','-31 days'))")
    assert db.prune_youtube(conn, 30) == (1, 1)
    assert [r[0] for r in conn.execute("SELECT video_id FROM videos")] == ["new"]
