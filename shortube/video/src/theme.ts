import { loadFont } from "@remotion/google-fonts/NotoSansKR";

export const { fontFamily } = loadFont("normal", { weights: ["500", "700", "900"] });

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  bg: "#0A0C16",
  bg2: "#141A33",
  text: "#F4F5FA",
  dim: "#7C8199",
  grid: "rgba(255,255,255,0.08)",
  accent: "#FFC93C",
  hot: "#FF5C7A",
};

export const springs = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 9 },
};
