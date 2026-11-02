// 한국어 자막을 넷플릭스 한국어 자막 지침(Korean Timed Text Style Guide)에 맞춘다.
// 규칙 정리: docs/video-editing-guide.md 4절. 모든 채널이 같이 쓴다.
//  - 한 줄 16자 (한글 1자, 라틴 문자 · 공백 · 문장부호 0.5자), 최대 두 줄 → 넘치면 자막을 둘로 나눈다
//  - 줄 끝 마침표 · 쉼표 없음, 말줄임은 "…" 한 글자, "!?" 는 "?!"
//  - 줄을 나눌 때는 문장부호 뒤를 먼저, 아래 줄이 더 긴 피라미드 모양을 고른다
//  - 읽기 속도는 성인 초당 12자 — 넘는 자막은 경고만 한다 (음성에 맞춘 자막이라 길이를 늘리지 않는다)

export const LINE = 16;
export const CPS = 12;

const half = (ch) => /[\x00-\x7F]|[ -⁯　-〿！-／…·「」『』“”‘’]/.test(ch);
export const width = (s) => [...s].reduce((w, ch) => w + (half(ch) ? 0.5 : 1), 0);
const letters = (s) => [...s].filter((ch) => /[\p{L}\p{N}]/u.test(ch)).length;

export function cleanKo(text) {
  return text
    .replace(/\.{3,}/g, "…")
    .replace(/!\?/g, "?!")
    .replace(/\s+/g, " ")
    .trim();
}
const trimEnd = (line) => line.replace(/[.,]+$/u, "").trim();

// 두 줄 이하로 나눌 수 있으면 줄 배열, 아니면 null
function breakTwo(text) {
  if (width(text) <= LINE) return [text];
  const words = text.split(" ");
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const wa = width(a), wb = width(b);
    if (wa > LINE || wb > LINE) continue;
    let score = Math.abs(wb - wa);
    if (wa > wb) score += 3; // 아래 줄이 더 길게
    if (/[,.!?…]$/.test(a)) score -= 10; // 문장부호 뒤에서 끊기
    if (!best || score < best.score) best = { score, lines: [a, b] };
  }
  return best?.lines ?? null;
}

// 한 자막(텍스트 + 프레임 구간)을 지침에 맞는 자막 하나 이상으로 바꾼다
export function splitKo(text, from, dur) {
  const t = cleanKo(text);
  const two = breakTwo(t);
  if (two) return [{ from, dur, text: two.map(trimEnd).join("\n") }];
  // 두 줄에 안 들어가면 문장부호 → 낱말 순서로 앞에서부터 32자 안쪽 덩어리로 자른다
  const parts = [];
  let rest = t;
  while (!breakTwo(rest)) {
    const words = rest.split(" ");
    let fit = 0; // 두 줄에 들어가는 가장 긴 앞부분
    let punct = 0; // 그 안에서 문장부호로 끝나는 가장 긴 앞부분
    for (let i = 1; i < words.length; i++) {
      const head = words.slice(0, i).join(" ");
      if (!breakTwo(head)) break;
      fit = i;
      if (/[,.!?…]$/.test(head)) punct = i;
    }
    const cut = punct >= fit / 2 ? punct : fit;
    if (cut === 0) break; // 띄어쓰기 없는 긴 덩어리 — 그대로 둔다
    parts.push(words.slice(0, cut).join(" "));
    rest = words.slice(cut).join(" ");
  }
  parts.push(rest);
  const total = parts.reduce((s, p) => s + width(p), 0);
  let at = from;
  return parts.map((p, i) => {
    const d = i === parts.length - 1 ? from + dur - at : Math.round((dur * width(p)) / total);
    const cue = { from: at, dur: d, text: (breakTwo(p) ?? [p]).map(trimEnd).join("\n") };
    at += d;
    return cue;
  });
}

// 초당 글자 수가 기준을 넘는 자막 목록 (경고용)
export function fastCues(cues, fps) {
  return cues.filter((c) => letters(c.text) / (c.dur / fps) > CPS);
}
