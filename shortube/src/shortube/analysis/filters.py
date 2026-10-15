"""키워드 의도 분류와 리스크 필터 (COMPLIANCE_GUIDE 1장, 3-4)."""

from __future__ import annotations

import re
from typing import Any


def squash(text: str) -> str:
    """비교용: 공백 제거 + 소문자."""
    return re.sub(r"\s+", "", text).lower()


def intent_of(keyword: str, suffixes: list[str]) -> str | None:
    """키워드에 포함된 의도 접미어 중 가장 긴 것."""
    k = squash(keyword)
    hits = [s for s in suffixes if squash(s) in k]
    return max(hits, key=lambda s: len(squash(s))) if hits else None


def exclusion_reason(keyword: str, settings: dict[str, Any], entity: str | None = None,
                     category: str | None = None) -> str | None:
    """후보에서 뺄 이유. 통과하면 None.

    - risk: 리스크 단어 포함 (근황, 논란, 열애 ...)
    - advice: 의료·투자·법률 조언형
    - noise: 콘텐츠 주제가 아닌 검색 (음원 재생, 광고 없는 모음 등)
    - off_whitelist: 작품 조합 키워드인데 허용된 사실형 의도가 없음 (배우 이름, 키스신, 몰아보기 등)
    """
    k = squash(keyword)
    if any(squash(w) in k for w in settings.get("risk_words", [])):
        return "risk"
    if any(re.search(p, keyword) for p in settings.get("advice_patterns", [])):
        return "advice"
    if any(squash(w) in k for w in settings.get("noise_words", [])):
        return "noise"
    # 카테고리별 필수 의도 (예: difference 카테고리는 '차이'가 들어간 것만)
    required = settings.get("category_required_intents", {}).get(category or "", [])
    if required and intent_of(keyword, required) is None:
        return "off_whitelist"
    if entity is not None:
        allowed = settings.get("entity_allowed_intents", [])
        rest = k.replace(squash(entity), "", 1)
        if rest and intent_of(rest, allowed) is None:
            return "off_whitelist"
    return None
