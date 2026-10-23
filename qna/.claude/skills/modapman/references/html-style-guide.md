# HTML 문서 스타일 가이드

family-youtube-plan.html에서 쓴 채널의 비주얼 아이덴티티를 그대로 재사용하기 위한 스타일/골격. 새 CSS를 짓지 말고 아래 `<style>` 블록을 그대로 복사해서 쓴다. 인터랙티브 탭·선택 기능은 빼고, 스크롤해서 읽는 정적 문서 형태로 단순화했다.

## 색·폰트 토큰 (고정)

- 배경(종이): `#E9EDE8` / 카드 배경: `#F6F8F4`, `#DFE6DE`
- 글자(잉크): `#1B2A26` / 보조 글자(연필): `#66756E`
- 포인트(빨강): `#B8352A`
- 제목 폰트: Gowun Batang (세리프) / 본문 폰트: Pretendard Variable
- 손글씨 느낌(질문·강조 카피용): Nanum Pen Script

## 전체 HTML 골격

아래 템플릿을 복사해서 `<!-- 내용 채우기 -->` 부분만 실제 산출물로 교체한다. `<title>`과 히어로의 질문/한 문장 정리는 이번 에피소드 내용으로 바꾼다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><!-- 에피소드 제목 --></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Pen+Script&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
<style>
:root{
  --paper:#E9EDE8; --surface:#F6F8F4; --surface-2:#DFE6DE;
  --ink:#1B2A26; --pencil:#66756E; --rule:#C4D0C6;
  --red:#B8352A; --red-soft:#E8CFCB; --maxw:860px;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:'Pretendard Variable',Pretendard,-apple-system,sans-serif;
  font-size:16px;line-height:1.75;letter-spacing:-0.01em}
h1,h2,h3{font-family:'Gowun Batang',serif;font-weight:700;line-height:1.35;margin:0}
p{margin:0 0 0.9em}
.page{max-width:var(--maxw);margin:0 auto;padding:0 20px 80px}
.hero{padding:64px 0 40px;
  background-image:repeating-linear-gradient(to bottom,transparent 0 37px,var(--rule) 37px 38px);
  background-position:0 8px}
.eyebrow{font-size:13px;color:var(--pencil);margin:0 0 22px}
.q-mark{font-family:'Nanum Pen Script',cursive;font-size:clamp(28px,5vw,40px);color:var(--red);display:block;margin-bottom:6px}
.q-text{font-family:'Nanum Pen Script',cursive;font-size:clamp(30px,5.5vw,48px);line-height:1.45;margin:0 0 22px}
.thesis{font-family:'Gowun Batang',serif;font-size:clamp(19px,3vw,26px);line-height:1.6;margin:0 0 8px}
.thesis b{color:var(--red)}
section.block{margin:44px 0;max-width:800px}
section.block h3{font-size:18px;margin-bottom:14px;padding-left:13px;border-left:3px solid var(--red)}
.body{font-size:15.5px}
.body ul{padding-left:19px;margin:0 0 1em}
.body li{margin-bottom:.45em}
.beats{border-top:1px solid var(--rule)}
.beat{display:grid;grid-template-columns:100px 1fr;gap:20px;padding:16px 0;border-bottom:1px solid var(--rule)}
.beat-time{font-size:13px;color:var(--pencil);padding-top:3px;font-variant-numeric:tabular-nums}
.beat-name{font-family:'Gowun Batang',serif;font-weight:700;font-size:16.5px;margin-bottom:5px}
.beat-desc{font-size:14.5px;color:var(--pencil);white-space:pre-line}
.beat.key .beat-name{color:var(--red)}
.tbl{width:100%;border-collapse:collapse;font-size:14.5px;margin-bottom:14px}
.tbl th,.tbl td{text-align:left;padding:11px 12px;border-bottom:1px solid var(--rule);vertical-align:top}
.tbl th{font-weight:600;font-size:13px;color:var(--pencil);border-bottom:1.5px solid var(--ink)}
.note{background:var(--surface);border-left:3px solid var(--red);padding:16px 20px;font-size:14.5px;margin:20px 0}
.note b{color:var(--red)}
.storyboard-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:14px}
.cut-card{background:var(--surface);border:1px solid var(--rule);border-radius:2px;padding:12px 14px}
.cut-num{font-family:'Gowun Batang',serif;font-weight:700;font-size:13.5px;color:var(--red);margin-bottom:6px}
.cut-angle{display:inline-block;font-size:11px;color:var(--pencil);border:1px solid var(--rule);border-radius:2px;padding:1px 6px;margin-bottom:8px}
.cut-desc{font-size:13.5px;margin-bottom:8px}
.cut-caption{font-size:13px;color:var(--pencil);font-style:italic}
.storyboard-wide{max-width:min(1000px, 96vw);margin-left:calc(50% - min(500px, 48vw));margin-right:calc(50% - min(500px, 48vw))}
.thumb-list{display:flex;flex-direction:column;gap:8px;font-size:15px}
.thumb-list li{background:var(--surface);border:1px solid var(--rule);padding:10px 14px;border-radius:2px}
.summary-line{font-family:'Gowun Batang',serif;font-size:clamp(18px,2.6vw,22px);
  background:var(--surface);border:1px solid var(--rule);padding:18px 22px;border-radius:2px}
footer{border-top:1px solid var(--rule);margin-top:50px;padding-top:20px;font-size:13px;color:var(--pencil)}
@media(max-width:640px){.beat{grid-template-columns:1fr;gap:4px}.beat-time{padding-top:0}}
</style>
</head>
<body>
<header class="hero"><div class="page">
  <p class="eyebrow">여덟 살의 질문 · <!-- 편수/날짜 --></p>
  <span class="q-mark">여덟 살 아이</span>
  <p class="q-text"><!-- 그 질문, 줄바꿈은 <br>로 --></p>
  <p class="thesis"><!-- 한 문장 정리, 강조 단어는 <b>로 --></p>
</div></header>

<main class="page">

<section class="block">
  <h3>자료조사 메모</h3>
  <div class="body"><ul><!-- <li> 반복 --></ul></div>
</section>

<section class="block">
  <h3>콘티</h3>
  <div class="beats">
    <!-- 7개 .beat div 반복, 6번 박자에만 class="beat key" -->
  </div>
</section>

<section class="block">
  <h3>그림 콘티</h3>
  <div class="storyboard-wide">
    <div class="storyboard-grid">
      <!-- .cut-card 반복, 또는 렌더링 도구가 있으면 실제 SVG 스토리보드 시트를 여기에 통째로 삽입 -->
    </div>
  </div>
</section>

<section class="block">
  <h3>전체 대본</h3>
  <div class="body">
    <!-- 박자별 <p><b>[N. 박자명 — 시간]</b><br>대사...</p> 반복 -->
  </div>
</section>

<section class="block">
  <h3>배경음악 · 효과음</h3>
  <table class="tbl"><!-- 박자 | 추천 --></table>
</section>

<section class="block">
  <h3>썸네일 문구 · 제목 후보</h3>
  <ul class="thumb-list"><!-- <li> 반복 --></ul>
</section>

<section class="block">
  <h3>한 문장 정리</h3>
  <p class="summary-line"><!-- 한 줄 --></p>
</section>

<footer><p>eight-year-olds-question 스킬로 생성한 에피소드 문서입니다.</p></footer>
</main>
</body>
</html>
```
