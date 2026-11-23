import { loadFont } from "@remotion/google-fonts/NotoSansKR";

export const { fontFamily } = loadFont("normal", { weights: ["500", "700", "900"] });

export const FPS = 30;
export const W = 1080;
export const H = 1920;
// 쇼츠 앱 안전 영역: 아래 y≈1560 · 오른쪽 x>950 · 위 y<200 에는 글자 · 핵심 숫자를 두지 않는다
export const SAFE = { top: 200, bottom: 1560, right: 950 };

export const C = {
  bg: "#050B18",
  text: "#F4F7FB",
  dim: "#8FA3BF",
  accent: "#FFC93C",
  hot: "#FF6B6B",
  sea: "#1B6CA8",
};
