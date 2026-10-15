"""설정 로더: config/*.yaml 과 .env 를 읽어 하나의 Config 객체로 묶는다."""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv

log = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
ENTITY_TYPES = {"work", "person"}


class ConfigError(ValueError):
    pass


@dataclass
class Category:
    name: str
    enabled: bool
    keywords: list[str]
    suffix: str = ""          # 질의할 때 시드 뒤에 붙일 말 (예: " 차이")


@dataclass
class Entity:
    name: str
    entity_type: str


@dataclass
class Config:
    root: Path
    categories: dict[str, Category]
    settings: dict[str, Any]
    sources: dict[str, Any]
    entities: list[Entity] = field(default_factory=list)

    @property
    def data_dir(self) -> Path:
        return self.root / "data"

    @property
    def output_dir(self) -> Path:
        return self.root / "output"

    @property
    def db_path(self) -> Path:
        return self.data_dir / "shortube.db"

    def enabled_categories(self) -> list[Category]:
        return [c for c in self.categories.values() if c.enabled]

    def work_entities(self) -> list[Entity]:
        return [e for e in self.entities if e.entity_type == "work"]


def _read_yaml(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise ConfigError(f"설정 파일이 없습니다: {path}")
    with path.open(encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    if not isinstance(data, dict):
        raise ConfigError(f"{path.name}의 최상위는 매핑이어야 합니다")
    return data


def parse_seeds(data: dict[str, Any]) -> dict[str, Category]:
    categories: dict[str, Category] = {}
    for name, body in data.items():
        if not isinstance(body, dict) or "keywords" not in body:
            raise ConfigError(f"seeds.yaml '{name}': enabled/keywords 형식이어야 합니다")
        keywords = [str(k).strip() for k in body.get("keywords") or [] if str(k).strip()]
        categories[name] = Category(name, bool(body.get("enabled", True)), keywords, str(body.get("suffix", "")))
    return categories


def parse_entities(raw: list[Any] | None) -> list[Entity]:
    entities: list[Entity] = []
    for item in raw or []:
        if not isinstance(item, dict) or "name" not in item:
            raise ConfigError(f"entities 항목은 {{name, entity_type}} 형식이어야 합니다: {item!r}")
        etype = item.get("entity_type")
        if etype not in ENTITY_TYPES:
            raise ConfigError(f"entity_type은 work 또는 person이어야 합니다: {item!r}")
        if etype == "person":
            log.warning("인물 entity '%s'는 키워드 조합에서 제외됩니다 (COMPLIANCE_GUIDE 1-1)", item["name"])
        entities.append(Entity(str(item["name"]).strip(), etype))
    return entities


def parse_auto_entities(data: dict[str, Any]) -> list[Entity]:
    """entities_auto.yaml에서 use: true이고 name이 있는 작품만."""
    return [
        Entity(str(w["name"]).strip(), "work")
        for w in data.get("works") or []
        if w.get("use") and w.get("name")
    ]


def load_config(root: Path | None = None) -> Config:
    root = root or PROJECT_ROOT
    load_dotenv(root / ".env")
    config_dir = root / "config"
    settings = _read_yaml(config_dir / "settings.yaml")
    entities = parse_entities(settings.get("entities"))
    auto_path = config_dir / "entities_auto.yaml"
    if auto_path.exists():
        names = {e.name for e in entities}
        entities += [e for e in parse_auto_entities(_read_yaml(auto_path)) if e.name not in names]
    return Config(
        root=root,
        categories=parse_seeds(_read_yaml(config_dir / "seeds.yaml")),
        settings=settings,
        sources=_read_yaml(config_dir / "sources.yaml"),
        entities=entities,
    )


def require_env(*names: str) -> dict[str, str]:
    """필요한 환경변수를 읽는다. 비어 있으면 어디서 발급받는지 알려주는 에러를 낸다."""
    values = {n: os.getenv(n, "").strip() for n in names}
    missing = [n for n, v in values.items() if not v]
    if missing:
        raise ConfigError(
            f".env에 {', '.join(missing)} 값이 없습니다. "
            ".env.example을 .env로 복사하고 발급 방법 주석을 참고해 채우세요."
        )
    return values
