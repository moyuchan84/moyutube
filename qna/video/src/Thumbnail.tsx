import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import assets from "./assets.json";
import { FONT, INK, PAPER, RED } from "./theme";

const cut = (name: string) => staticFile(`ep01/cuts/${name}`);

const Framed: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => (
  <div style={{ position: "absolute", border: `6px solid ${INK}`, boxSizing: "border-box", overflow: "hidden", ...style }}>
    <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

// 원고의 썸네일 문구 3안을 그대로 하나씩
// 그림(컷인 얼굴)을 합성한 썸네일: 묻는 아이 · 당황한 아빠 위, 큰 글자는 아래 띠에
// top · bottom 은 [흰 글자, 노란 글자] (bottom 은 [흰, 노랑] 순서 그대로)
// topic 은 두 얼굴 사이에 스티커로 붙는 주제 그림(art id). 적은 순서대로, 이미 만들어진 것 중 앞의 3장만 쓴다.
// layout 은 구도(편마다 다르게 골라 같은 영상처럼 보이지 않게), kid · dad 는 표정(art/common/cutin 의 파일 이름)
export type FaceText = {
  tag: string;
  top: [string, string];
  bottom: [string, string];
  topic?: string[];
  layout?: keyof typeof LAYOUTS;
  kid?: string;
  dad?: string;
};
const EP01_FACE: FaceText = { tag: "여덟 살 아들의 질문", top: ["호텔? ", "모텔?"], bottom: ["아빠,", " 뭐가 달라요?"] };

type Sticker = [x: number, y: number, size: number, tilt: number];
type Layout = {
  bg: [string, string, string]; // 가운데 → 가장자리
  burst: string; // 햇살 무늬의 중심
  tilt: number; // 글자 띠의 기울기
  tagRight?: boolean;
  kid: React.CSSProperties;
  dad: React.CSSProperties;
  stickers: Sticker[]; // 3장 기준 자리. 장수가 적으면 앞에서부터 쓴다
};

const LAYOUTS = {
  // 아이 왼쪽 · 아빠 오른쪽, 나란히 (1 · 2편)
  side: {
    bg: ["#FFE98A", "#FFC83C", "#F59E1B"],
    burst: "50% 36%",
    tilt: -1.5,
    kid: { left: -52, top: 40, height: 540 },
    dad: { right: -84, top: 6, height: 590 },
    stickers: [[640, 112, 214, -4], [532, 318, 204, -8], [748, 318, 204, 7]],
  },
  // 아이는 똑바로, 아빠는 위에서 거꾸로 매달려 있다
  hang: {
    bg: ["#D9F7C4", "#8EDB8A", "#3DA86B"],
    burst: "72% 0%",
    tilt: 1.5,
    tagRight: true,
    kid: { left: -30, top: 28, height: 600 },
    dad: { right: 40, top: -160, height: 590, transform: "rotate(172deg)" },
    stickers: [[560, 96, 176, -6], [498, 300, 196, 5], [676, 372, 150, -9]],
  },
  // 아이가 화면 가운데를 크게 차지하고, 아빠는 구석에서 빼꼼
  peek: {
    bg: ["#CDEBFF", "#7CC4F5", "#3A8FD6"],
    burst: "40% 40%",
    tilt: -1.5,
    kid: { left: 250, top: -40, height: 720 },
    dad: { right: -150, top: 150, height: 420, transform: "rotate(-14deg)" },
    stickers: [[150, 130, 220, -7], [1000, 110, 190, 8], [150, 340, 170, 6]],
  },
} satisfies Record<string, Layout>;

const FaceThumbnail: React.FC<{ text: FaceText }> = ({ text }) => {
  const topic = (text.topic ?? []).filter((id) => id in assets).slice(0, 3);
  const L: Layout = LAYOUTS[text.layout ?? "side"];
  // 주제 그림이 없는 나란히 구도는 얼굴을 크게 (1편 썸네일 그대로)
  const plain = !text.layout && topic.length === 0;
  const kid = plain ? { left: 30, top: 6, height: 590 } : L.kid;
  const dad = plain ? { right: 10, top: -22, height: 640 } : L.dad;
  const face = (name: string) => staticFile(`art/common/cutin/${name}.webp`);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, fontWeight: 700, overflow: "hidden", background: `radial-gradient(circle at ${L.burst}, ${L.bg[0]} 0%, ${L.bg[1]} 55%, ${L.bg[2]} 100%)` }}>
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from 0deg at ${L.burst}, rgba(255,255,255,0.22) 0deg 6deg, rgba(255,255,255,0) 6deg 18deg)` }} />
      <Img src={face(text.dad ?? "dad-panic")} style={{ position: "absolute", ...dad }} />
      <Img src={face(text.kid ?? "kid-ask")} style={{ position: "absolute", ...kid }} />
      {topic.map((id, i) => {
        const [x, y, size, tilt] = L.stickers[i];
        return (
          <div key={id} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", backgroundColor: "#fff", border: `7px solid ${INK}`, boxSizing: "border-box", boxShadow: "0 10px 0 rgba(0,0,0,0.18)", transform: `rotate(${tilt}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img src={staticFile(`art/${id}.webp`)} style={{ width: "72%", height: "72%", objectFit: "contain" }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: -20, right: -20, bottom: -30, height: 300, backgroundColor: INK, transform: `rotate(${L.tilt}deg)`, borderTop: "10px solid #fff" }} />
      <div style={{ position: "absolute", ...(L.tagRight ? { right: 44 } : { left: 44 }), bottom: 250, fontSize: 40, color: "#fff", backgroundColor: RED, padding: "4px 22px", borderRadius: 8, transform: `rotate(${L.tilt}deg)` }}>
        {text.tag}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 118, textAlign: "center", fontSize: 132, lineHeight: 1, color: "#fff", letterSpacing: -4 }}>
        {text.top[0]}<span style={{ color: "#FFD43B" }}>{text.top[1]}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center", fontSize: 96, lineHeight: 1, color: "#FFD43B", letterSpacing: -3 }}>
        <span style={{ color: "#fff" }}>{text.bottom[0]}</span>{text.bottom[1]}
      </div>
    </AbsoluteFill>
  );
};

export const Thumbnail: React.FC<{ variant: "a" | "b" | "c" | "d"; face?: FaceText }> = ({ variant, face }) => {
  if (variant === "d") return <FaceThumbnail text={face ?? EP01_FACE} />;
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: FONT, fontWeight: 700 }}>
      {variant === "a" ? (
        <>
          <Framed src={cut("panel04.png")} style={{ right: 32, top: 140, width: 610, height: 440 }} />
          <div style={{ position: "absolute", left: 48, top: 92, fontSize: 96, lineHeight: 1.12, color: INK, letterSpacing: -3 }}>
            호텔
            <br />
            모텔
            <br />
            유스호스텔
            <div style={{ color: RED, fontSize: 92, marginTop: 14 }}>뭐가 달라요?</div>
          </div>
        </>
      ) : null}
      {variant === "b" ? (
        <>
          <Framed src={cut("panel02.png")} style={{ right: 32, top: 150, width: 500, height: 420 }} />
          <div style={{ position: "absolute", left: 48, top: 110, color: INK }}>
            <div style={{ fontSize: 92, letterSpacing: -4, position: "relative", display: "inline-block" }}>
              “가격 차이야”
              <div style={{ position: "absolute", left: -8, right: -8, top: "54%", height: 14, backgroundColor: RED, transform: "rotate(-4deg)" }} />
            </div>
            <div style={{ fontSize: 70, marginTop: 50, lineHeight: 1.25, letterSpacing: -2 }}>
              이거 사실
              <br />
              <span style={{ color: PAPER, backgroundColor: RED, padding: "0 16px" }}>틀린 답</span>이었습니다
            </div>
          </div>
        </>
      ) : null}
      {variant === "c" ? (
        <>
          {[
            ["panel06.png", "귀족을 위해"],
            ["panel07.png", "자동차를 위해"],
            ["panel08.png", "아이들을 위해"],
          ].map(([src, label], i) => (
            <div key={src} style={{ position: "absolute", left: 30 + i * 414, top: 180, width: 392 }}>
              <Framed src={cut(src)} style={{ position: "relative", width: 392, height: 320 }} />
              <div style={{ fontSize: 58, color: RED, textAlign: "center", marginTop: 34, letterSpacing: -2 }}>{label}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 56, textAlign: "center", fontSize: 76, color: INK, letterSpacing: -2 }}>
            호텔 · 모텔 · 유스호스텔
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
