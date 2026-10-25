// 한글 대사 → 입모양. 음성 길이에 맞춰 음절을 훑으며 모음 모양(벌림 · 폭)을 정하고,
// 음성 파일이 있으면 프레임별 음량으로 벌림 크기를 맞춘다. (음성이 없어도 글자만으로 움직인다)
export type Mouth = { open: number; wide: number }; // open: 0 닫힘~1 크게 벌림, wide: 0 오므림~1 옆으로 넓게

const CLOSED: Mouth = { open: 0, wide: 0.5 };

// 중성(모음) 번호 → [벌림, 폭]
const VOWEL: Record<number, [number, number]> = {
  0: [1, 0.8], 1: [0.8, 0.9], 2: [1, 0.8], 3: [0.8, 0.9], // ㅏ ㅐ ㅑ ㅒ
  4: [0.8, 0.6], 5: [0.55, 0.95], 6: [0.8, 0.6], 7: [0.55, 0.95], // ㅓ ㅔ ㅕ ㅖ
  8: [0.7, 0.2], 9: [0.8, 0.45], 10: [0.7, 0.6], 11: [0.5, 0.4], 12: [0.7, 0.2], // ㅗ ㅘ ㅙ ㅚ ㅛ
  13: [0.5, 0.1], 14: [0.6, 0.35], 15: [0.5, 0.5], 16: [0.4, 0.3], 17: [0.5, 0.1], // ㅜ ㅝ ㅞ ㅟ ㅠ
  18: [0.35, 0.95], 19: [0.4, 0.9], 20: [0.3, 1], // ㅡ ㅢ ㅣ
};
const LIP_CHO = new Set([6, 7, 8, 17]); // ㅁ ㅂ ㅃ ㅍ: 입술이 붙는다

type Syl = { open: number; wide: number; lips: boolean };

export const syllables = (text: string): Syl[] => {
  const out: Syl[] = [];
  for (const ch of text) {
    const c = ch.codePointAt(0)!;
    if (c >= 0xac00 && c <= 0xd7a3) {
      const idx = c - 0xac00;
      const jung = Math.floor((idx % 588) / 28);
      const cho = Math.floor(idx / 588);
      const [open, wide] = VOWEL[jung] ?? [0.6, 0.6];
      out.push({ open, wide, lips: LIP_CHO.has(cho) });
    } else if (/[0-9A-Za-z]/.test(ch)) {
      out.push({ open: 0.6, wide: 0.6, lips: false });
    }
  }
  return out;
};

// t: 0~1 (대사 안에서 지금 위치)
export const mouthAt = (syls: Syl[], t: number, env: number | null): Mouth => {
  if (!syls.length || t < 0 || t > 1) return CLOSED;
  const pos = t * syls.length;
  const i = Math.min(syls.length - 1, Math.floor(pos));
  const s = syls[i];
  const frac = pos - i;
  // 음절 안에서 열렸다 닫히는 곡선, 입술소리는 시작이 닫혀 있다
  const pulse = Math.sin(Math.PI * Math.min(1, frac * 1.15)) ** 0.7;
  let open = s.open * pulse * (s.lips && frac < 0.3 ? frac / 0.3 : 1);
  if (env != null) open *= 0.25 + 0.75 * env; // 실제 음량이 작으면 입도 작게
  if (env != null && env < 0.04) open = 0;
  return { open: Math.max(0, Math.min(1, open)), wide: s.wide };
};
