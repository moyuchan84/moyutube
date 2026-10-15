from datetime import date

import yaml

from shortube.collectors import ott_works as ow
from shortube.config import parse_auto_entities

WIKITEXT = """
==New series and returning shows==
{| class="wikitable sortable"
|-
! scope="col" | Title
! scope="col" | Channel/Platform
! scope="col" | First Aired
! scope="col" | Last Aired
! scope="col" | Status
! scope="col" class="unsortable" | {{Ref.|multi=yes}}
|-
| ''[[Between Steps]]''
| [[ENA (South Korean TV channel)|ENA]]
| {{dts|October 5}}
| {{dtsi|November 10}}
| Ongoing
| <ref name="x" />
|-
| ''[[Merry Berry Love]]''{{Efn|name=sk-j|A South Korean-Japanese co-production.}}
| [[Hulu]]/[[Disney+]]
| {{dts|October 7}}
| {{dtsi|November 4}}
| Ongoing
| <ref name="x" />
|-
| ''[[Take Charge of My Heart]]''
| [[Netflix]]
| colspan="2" style="text-align:center" | {{dts|October 9}}
| Ended
| <ref name="x" />
|-
| ''[[Make Me Tingle]]''
| [[TVING]]
| {{dtsi|October 15}}
| {{dtsi|}}
| Awaiting release
| <ref name="x" />
|-
| ''[[Summer Vacation (2026 TV series)|Summer Vacation]]''
| [[Wavve]]/Lifetime
| {{dtsi|October 26}}
| {{dtsi|November 24}}
| Awaiting release
| <ref name="x" />
|-
| data-sort-value="Old Show, The" | ''[[The Old Show]]''
| [[Netflix]]
| {{dts|2026|9|1}}
| {{dts|2026|9|20}}
| Ended
| <ref name="x" />
|}

==Ending==
"""


def test_parse_works_columns():
    works = {w.title_en: w for w in ow.parse_works(WIKITEXT, 2026)}
    assert set(works) == {"Between Steps", "Merry Berry Love", "Take Charge of My Heart",
                          "Make Me Tingle", "Summer Vacation", "The Old Show"}
    assert works["Take Charge of My Heart"].first_aired == date(2026, 10, 9)   # colspan 처리
    assert works["Merry Berry Love"].platforms == ["Hulu", "Disney+"]
    assert works["Summer Vacation"].article == "Summer Vacation (2026 TV series)"
    assert works["The Old Show"].first_aired == date(2026, 9, 1)               # data-sort-value, 숫자형 날짜
    assert works["Between Steps"].platforms == ["ENA"]


def test_filter_window_and_platform():
    works = ow.parse_works(WIKITEXT, 2026)
    picked = ow.filter_works(works, ["Netflix", "TVING", "Disney+", "Wavve"], date(2026, 10, 1), date(2026, 10, 15))
    assert [w.title_en for w in picked] == ["Merry Berry Love", "Take Charge of My Heart", "Make Me Tingle"]


def test_find_hangul_variants():
    assert ow.find_hangul("'''''X''''' ({{Korean|나를 충전해줘}}) is") == "나를 충전해줘"
    assert ow.find_hangul("| native_name = {{Infobox Korean television name|hangul=^나를 충전해_줘|lk=R}}") == "나를 충전해 줘"
    assert ow.find_hangul("{{Korean|hangul=메리 베리 러브|rr=...}}") == "메리 베리 러브"
    assert ow.find_hangul("no korean here {{Korean|Romaji}}") is None
    assert ow.clean_ko_title("여름방학 (2026년 드라마)") == "여름방학"


class FakeClient:
    calls = 0

    def langlinks(self, titles, lang):
        return {"Take Charge of My Heart": "나를 충전해줘"}

    def page_wikitext(self, title):
        if title == "Make Me Tingle":
            return "'''Make Me Tingle''' ({{Korean|내가 떨릴 수 있게}})", 1
        return "no hangul", 1


def test_resolve_and_yaml_keeps_user_edits(tmp_path):
    works = ow.filter_works(ow.parse_works(WIKITEXT, 2026), ["Netflix", "TVING", "Disney+"],
                            date(2026, 10, 1), date(2026, 10, 15))
    ow.resolve_korean_titles(FakeClient(), works)
    titles = {w.title_en: w.ko_title for w in works}
    assert titles == {"Merry Berry Love": None, "Take Charge of My Heart": "나를 충전해줘",
                      "Make Me Tingle": "내가 떨릴 수 있게"}

    path = tmp_path / "entities_auto.yaml"
    ow.write_yaml(path, works, [], date(2026, 10, 1), date(2026, 10, 15))
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    by_en = {w["title_en"]: w for w in data["works"]}
    assert by_en["Merry Berry Love"]["use"] is False

    # 사람이 수정: 하나는 끄고, 제목 없는 작품은 이름을 채워 켬
    by_en["Make Me Tingle"]["use"] = False
    by_en["Merry Berry Love"].update(name="메리 베리 러브", use=True)
    path.write_text(yaml.safe_dump(data, allow_unicode=True), encoding="utf-8")

    ow.write_yaml(path, works, [], date(2026, 10, 1), date(2026, 10, 15))
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    assert [e.name for e in parse_auto_entities(data)] == ["메리 베리 러브", "나를 충전해줘"]
