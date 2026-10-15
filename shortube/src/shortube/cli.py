"""typer 진입점: python -m shortube <command>"""

from __future__ import annotations

import logging
from pathlib import Path

import typer

from shortube import db
from shortube.config import ConfigError, load_config

app = typer.Typer(help="shortube 키워드·쇼츠 패턴 분석", no_args_is_help=True)
log = logging.getLogger("shortube")


def _setup_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )


@app.callback()
def main(verbose: bool = typer.Option(False, "--verbose", "-v", help="디버그 로그 출력")) -> None:
    _setup_logging(verbose)


def _not_ready(phase: str) -> None:
    typer.echo(f"아직 구현되지 않았습니다 ({phase}에서 구현 예정).")
    raise typer.Exit(code=1)


@app.command()
def init() -> None:
    """설정을 검증하고 SQLite 스키마를 만든다."""
    try:
        cfg = load_config()
    except ConfigError as e:
        typer.echo(f"설정 오류: {e}")
        raise typer.Exit(code=2)
    conn = db.connect(cfg.db_path)
    tables = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")]
    conn.close()
    enabled = ", ".join(c.name for c in cfg.enabled_categories())
    typer.echo(f"DB: {cfg.db_path}")
    typer.echo(f"테이블: {', '.join(tables)}")
    typer.echo(f"활성 카테고리: {enabled}")
    typer.echo(f"작품 entity: {len(cfg.work_entities())}개")


@app.command()
def entities(force: bool = typer.Option(False, help="오늘 이미 수집했어도 다시 수집")) -> None:
    """최근 공개된 OTT 오리지널 작품을 위키백과에서 수집해 config/entities_auto.yaml 생성."""
    from datetime import date, timedelta

    from shortube.collectors import ott_works
    from shortube.collectors.wiki import WikiClient

    cfg = load_config()
    opts = cfg.settings.get("ott_works", {})
    lookback = int(opts.get("lookback_days", 14))
    platforms = list(opts.get("platforms", []))
    today = date.today()
    out = cfg.root / "config" / "entities_auto.yaml"
    conn = db.connect(cfg.db_path)
    if not force and out.exists() and db.fetched_today(conn, ott_works.SOURCE, "ko_tv"):
        typer.echo(f"오늘 이미 수집했습니다: {out} (다시 수집하려면 --force)")
        return
    client = WikiClient(lang="en")
    try:
        works, pages = ott_works.collect(client, today, lookback, platforms)
    except Exception as e:  # 외부 소스 실패가 다른 단계를 막지 않도록
        db.log_fetch(conn, ott_works.SOURCE, "ko_tv", "failed", str(e))
        typer.echo(f"작품 수집 실패: {e}")
        raise typer.Exit(code=1)
    finally:
        db.add_usage(conn, "wikipedia", client.calls)
    ott_works.save_db(conn, works, pages)
    ott_works.write_yaml(out, works, pages, today - timedelta(days=lookback), today)
    db.log_fetch(conn, ott_works.SOURCE, "ko_tv", "ok", f"{len(works)} works")
    conn.close()
    typer.echo(f"위키 API 호출 {client.calls}회, 작품 {len(works)}개 → {out}")
    for w in works:
        mark = w.ko_title or "(한국어 제목 미확인 → 제외)"
        typer.echo(f"  {w.first_aired}  {'/'.join(w.platforms):<18} {mark}  [{w.title_en}]")


@app.command()
def differences(top: int = typer.Option(40, help="출력할 상위 주제 수")) -> None:
    """'A B 차이' 자동완성 → 주제 후보 순위 (output/difference_topics.csv)."""
    from shortube.analysis import differences as dif

    cfg = load_config()
    conn = db.connect(cfg.db_path)
    rows = dif.load_rows(conn)
    conn.close()
    topics = dif.build_topics(rows, cfg.settings.get("done_topics", []))
    out = cfg.output_dir / "difference_topics.csv"
    dif.write_csv(out, topics)
    typer.echo(f"제안어 {len(rows)}개 → 주제 {len(topics)}개 → {out}")
    for i, t in enumerate(topics[:top], 1):
        mark = f"  [이미 만든 편: {t.done}]" if t.done else ""
        typer.echo(f"{i:>3}. {t.label:<28} 점수 {t.score:<5} (시드 {len(t.seeds)}, 표기 {len(t.variants)}){mark}")


@app.command()
def pick(
    count: int = typer.Option(1, help="오늘 만들 영상 수 (1~2)"),
    as_json: bool = typer.Option(False, "--json", help="JSON으로 출력"),
) -> None:
    """오늘의 주제를 로테이션 규칙으로 고른다 (기록은 하지 않음 → log-topic)."""
    import json
    from datetime import date

    from shortube.analysis import planner

    cfg = load_config()
    conn = db.connect(cfg.db_path)
    slots = planner.plan(conn, cfg.settings, [e.name for e in cfg.work_entities()], date.today(), count)
    conn.close()
    if as_json:
        typer.echo(json.dumps([s.__dict__ for s in slots], ensure_ascii=False, indent=2))
        return
    if not slots:
        typer.echo("고를 주제가 없습니다. 오늘 이미 다 골랐거나 후보가 없습니다 (entities / autocomplete 실행 확인).")
    for s in slots:
        head = f"[슬롯 {s.slot}] {s.category}" + (f" — 작품: {s.entity}" if s.entity else "")
        typer.echo(head)
        for c in s.shortlist:
            typer.echo(f"   - {c['keyword']}  (의도: {c['intent'] or '-'})")


@app.command("log-topic")
def log_topic(
    keyword: str = typer.Argument(..., help="최종 선택한 키워드"),
    category: str = typer.Option(..., help="카테고리"),
    entity: str = typer.Option(None, help="작품명 (explain)"),
    intent: str = typer.Option(None, help="의도"),
    brief: str = typer.Option(None, help="제작 브리프 파일 경로"),
) -> None:
    """선택한 주제를 이력에 기록한다 (쿨다운·로테이션에 반영)."""
    from datetime import date

    from shortube.analysis import planner

    cfg = load_config()
    conn = db.connect(cfg.db_path)
    slot = planner.record(conn, date.today(), category, keyword, entity, intent, brief)
    conn.close()
    typer.echo(f"기록: {date.today()} 슬롯 {slot} — [{category}] {keyword}")


@app.command()
def trends(seeds: Path = typer.Option(Path("config/seeds.yaml"), help="시드 파일")) -> None:
    """네이버 DataLab · 구글 트렌드 · 위키 조회수 수집."""
    _not_ready("Phase 2~3")


@app.command()
def autocomplete(
    seeds: Path = typer.Option(Path("config/seeds.yaml"), help="시드 파일"),
    expand: bool = typer.Option(False, help="자음/알파벳 확장 수집"),
) -> None:
    """유튜브 자동완성 수집 + 의도 분류 + 리스크 필터."""
    from shortube.collectors import autocomplete as ac

    cfg = load_config()
    conn = db.connect(cfg.db_path)
    stats = ac.run(cfg, conn, expand=expand)
    by_reason = conn.execute(
        "SELECT COALESCE(excluded_reason,'kept') r, COUNT(*) n FROM candidates GROUP BY r ORDER BY n DESC"
    ).fetchall()
    conn.close()
    typer.echo(
        f"자동완성 호출 {stats['queries']}회 (캐시 {stats['cached']}, 실패 {stats['failed']}) / "
        f"이번 실행 제안어: 통과 {stats['kept']}, 제외 {stats['excluded']}"
    )
    typer.echo("후보 누계: " + ", ".join(f"{r['r']} {r['n']}" for r in by_reason))


@app.command()
def shorts(
    keywords_from: str = typer.Option("autocomplete", help="키워드 출처"),
    top: int = typer.Option(30, help="검색할 상위 키워드 수"),
) -> None:
    """YouTube Data API로 경쟁 쇼츠 수집."""
    _not_ready("Phase 4")


@app.command()
def report() -> None:
    """점수표 + 리포트 생성."""
    _not_ready("Phase 5")


@app.command()
def prune() -> None:
    """보관 기한이 지난 YouTube API 데이터 정리."""
    cfg = load_config()
    conn = db.connect(cfg.db_path)
    days = int(cfg.settings.get("shorts", {}).get("retention_days", 30))
    v, c = db.prune_youtube(conn, days)
    conn.close()
    typer.echo(f"{days}일 지난 데이터 삭제: videos {v}행, channels {c}행")


@app.command("run-all")
def run_all() -> None:
    """prune 후 전체 단계를 순서대로 실행."""
    _not_ready("Phase 6")
