// 브리프 output/briefs/2026-10-15_slot1.md 의 사실 카드(F1·F2·F4·F6·F7·F8)만 사용한다.
// 출처: Netflix Top 10 공식 데이터 (대한민국, TV), 2026-10-15 확인.

export const WEEKS = ["9/14–20", "9/21–27", "9/28–10/4"];

export type Series = {
  id: string;
  label: string;
  color: string;
  // 주간 순위. "out" = TOP 10 밖, null = 아직 공개 전
  ranks: (number | "out" | null)[];
};

export const SERIES: Series[] = [
  { id: "scandal", label: "스캔들", color: "#FF5C7A", ranks: [1, 2, 3] },
  { id: "kian2", label: "기안장 시즌2", color: "#FFC93C", ranks: [null, 1, 1] },
  { id: "fourhands", label: "포핸즈", color: "#9D8CFF", ranks: [2, 3, 4] },
  { id: "kian1", label: "기안장 시즌1", color: "#5FD4FF", ranks: ["out", 10, 7] },
];

export const LONG_RUN = { title: "참교육", weeks: 12, rank: 10, nextLongest: 9 };

// F8: 신작 한국어 제목 미확인 → 이름 없이 "신작"으로 표시
export const THIS_WEEK = [
  { rank: 1, label: "기안장 시즌2", isNew: false },
  { rank: 2, label: "신작", isNew: true },
  { rank: 3, label: "스캔들", isNew: false },
  { rank: 4, label: "포핸즈", isNew: false },
  { rank: 5, label: "· · ·", isNew: false },
  { rank: 6, label: "신작", isNew: true },
];

export const AS_OF = "2026.9.28~10.4 기준 · 출처: Netflix Top 10 (대한민국 TV)";
