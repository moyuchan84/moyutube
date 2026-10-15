"""MediaWiki API 어댑터. 위키 관련 외부 호출은 모두 여기를 거친다."""

from __future__ import annotations

import logging
import os
import time
from typing import Any

import requests

from shortube import __version__

log = logging.getLogger(__name__)

API = "https://{lang}.wikipedia.org/w/api.php"


def user_agent() -> str:
    contact = os.getenv("WIKIMEDIA_CONTACT", "").strip()
    if not contact:
        log.warning(".env의 WIKIMEDIA_CONTACT가 비어 있습니다. Wikimedia는 User-Agent에 연락처를 넣도록 요구합니다.")
        contact = "contact not set"
    return f"shortube/{__version__} ({contact})"


class WikiClient:
    def __init__(self, lang: str = "en", min_interval: float = 1.0, session: requests.Session | None = None):
        self.lang = lang
        self.min_interval = min_interval
        self.session = session or requests.Session()
        self.session.headers["User-Agent"] = user_agent()
        self._last = 0.0
        self.calls = 0

    def _get(self, **params: Any) -> dict[str, Any]:
        wait = self.min_interval - (time.monotonic() - self._last)
        if wait > 0:
            time.sleep(wait)
        params.update(format="json", formatversion=2)
        resp = self.session.get(API.format(lang=self.lang), params=params, timeout=30)
        self._last = time.monotonic()
        self.calls += 1
        resp.raise_for_status()
        data = resp.json()
        if "error" in data:
            raise RuntimeError(f"MediaWiki 오류: {data['error'].get('info')}")
        return data

    def page_wikitext(self, title: str) -> tuple[str, int] | None:
        """문서 원문(wikitext)과 revid. 문서가 없으면 None."""
        data = self._get(action="query", prop="revisions", rvprop="ids|content", rvslots="main",
                         titles=title, redirects=1)
        page = data["query"]["pages"][0]
        if page.get("missing"):
            return None
        rev = page["revisions"][0]
        return rev["slots"]["main"]["content"], rev["revid"]

    def langlinks(self, titles: list[str], target_lang: str) -> dict[str, str]:
        """{원 문서 제목: 대상 언어 문서 제목}. 리다이렉트를 따라간 경우 원래 제목 기준으로 돌려준다."""
        result: dict[str, str] = {}
        for i in range(0, len(titles), 50):
            batch = titles[i:i + 50]
            data = self._get(action="query", prop="langlinks", lllang=target_lang, lllimit="max",
                             titles="|".join(batch), redirects=1)
            q = data["query"]
            alias = {}
            for key in ("normalized", "redirects"):
                for r in q.get(key, []):
                    alias[r["to"]] = alias.get(r["from"], r["from"])
            for page in q.get("pages", []):
                links = page.get("langlinks") or []
                if links:
                    result[alias.get(page["title"], page["title"])] = links[0]["title"]
        return result
