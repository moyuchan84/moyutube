"""API 키 · 설정값 읽기 (파이썬용, shared/env.mjs 와 같은 규칙).

찾는 순서: 환경변수 → 저장소 루트 .env → 프로젝트 .env. 키 값은 코드 · 로그 · 문서에 쓰지 않는다.
"""

from __future__ import annotations

import os
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def _from_file(path: Path, name: str) -> str | None:
    if not path.exists():
        return None
    match = re.search(rf'^\s*{re.escape(name)}\s*=\s*"?([^"\s]+)', path.read_text(encoding="utf-8"), re.M)
    return match.group(1) if match else None


def env_value(name: str, project_dir: Path | None = None) -> str | None:
    if os.environ.get(name):
        return os.environ[name]
    for path in [REPO / ".env", *([project_dir / ".env"] if project_dir else [])]:
        value = _from_file(path, name)
        if value:
            return value
    return None
