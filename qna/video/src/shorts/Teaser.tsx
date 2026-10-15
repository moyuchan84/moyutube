import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Episode } from "../Episode";
import { FONT, GRAY, INK, PAPER, RED } from "../theme";

// 롱폼 한 구간을 잘라 9:16 맛보기 쇼츠로 만든다 (모라구 채널 유입용).
// 위: 시리즈 표시 + 훅 문구 / 가운데: 롱폼 화면(그림 + 자막 칸) / 끝: "본편에서" 카드
// 아래 약 350px 은 쇼츠 UI(제목 · 버튼)가 덮는 자리라 중요한 글자를 두지 않는다.

const SRC_W = 1920;
const SRC_H = 1080;
// 그림 칸(약 1143px)보다 조금 넓게 잘라야 긴 자막 한 줄이 다 들어간다
const CROP_W = 1260;
const CROP_LEFT = (SRC_W - CROP_W) / 2;
const SCALE = 1080 / CROP_W;
const VIEW_TOP = 450;
export const END_CARD = 75; // 끝 카드 길이(프레임)

type Timeline = React.ComponentProps<typeof Episode>["timeline"];

export type TeaserProps = {
  episode: string;
  timeline: Timeline;
  start: number; // 롱폼 프레임 기준 시작
  end: number; // 롱폼 프레임 기준 끝
  series: string; // "여덟 살 아들의 호기심 3편"
  hook: [string, string]; // 위 큰 글자 두 줄 (둘째 줄 빨강)
  endTitle: [string, string];
  endSub: string;
};

export const Teaser: React.FC<TeaserProps> = ({ episode, timeline, start, end, series, hook, endTitle, endSub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clip = end - start;
  const hookIn = spring({ frame, fps, config: { damping: 14 } });
  const endIn = spring({ frame: frame - clip, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: FONT }}>
      {/* 위: 시리즈 + 훅 */}
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ display: "inline-block", fontSize: 38, fontWeight: 800, color: PAPER, background: INK, borderRadius: 999, padding: "10px 30px" }}>
          {series}
        </div>
        <div style={{ marginTop: 26, fontWeight: 900, lineHeight: 1.12, transform: `scale(${0.85 + hookIn * 0.15})`, opacity: hookIn }}>
          <div style={{ fontSize: 84, color: INK }}>{hook[0]}</div>
          <div style={{ fontSize: 96, color: RED }}>{hook[1]}</div>
        </div>
      </div>

      {/* 가운데: 롱폼 화면을 그림 칸 너비에 맞춰 잘라 넣는다 */}
      <div style={{ position: "absolute", top: VIEW_TOP, left: 0, width: 1080, height: SRC_H * SCALE, overflow: "hidden" }}>
        <div style={{ width: SRC_W, height: SRC_H, transform: `translateX(${-CROP_LEFT * SCALE}px) scale(${SCALE})`, transformOrigin: "0 0" }}>
          <Sequence from={-start} durationInFrames={end} layout="none">
            <Episode episode={episode} timeline={timeline} />
          </Sequence>
        </div>
      </div>

      {/* 끝 카드 */}
      {frame >= clip ? (
        <AbsoluteFill style={{ backgroundColor: `rgba(246,238,223,${interpolate(endIn, [0, 1], [0, 0.96])})` }}>
          <div style={{ position: "absolute", top: 640, left: 60, right: 60, textAlign: "center", transform: `translateY(${(1 - endIn) * 80}px)`, opacity: endIn }}>
            <div style={{ fontSize: 92, fontWeight: 900, color: INK, lineHeight: 1.15 }}>{endTitle[0]}</div>
            <div style={{ fontSize: 104, fontWeight: 900, color: RED, lineHeight: 1.15 }}>{endTitle[1]}</div>
            <div style={{ marginTop: 50, fontSize: 46, fontWeight: 800, color: GRAY }}>{endSub}</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// 롱폼 타임라인에서 구간 찾기: from 컷의 몇 번째 대사부터, to 컷 끝까지
export const teaserRange = (timeline: Timeline, from: { cut: string; line?: number }, toCut: string) => {
  const a = timeline.cuts.find((c) => c.id === from.cut);
  const b = timeline.cuts.find((c) => c.id === toCut);
  if (!a || !b) throw new Error(`컷을 찾지 못했습니다: ${from.cut} / ${toCut}`);
  const lineFrom = from.line !== undefined ? a.lines[from.line].from : 0;
  return { start: Math.max(0, a.from + lineFrom - 6), end: b.from + b.duration };
};
