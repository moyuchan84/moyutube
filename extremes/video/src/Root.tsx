import React from "react";
import { Composition } from "remotion";
import { Short, ThumbStill, totalFrames, type ShotsData } from "./Short";
import { Long, LongThumb, LW, LH, totalLongFrames, type LongData, type Timings } from "./Long";
import { H, W } from "./theme";
import { ChannelAvatar, ChannelBanner } from "./ChannelArt";
// 편 목록은 content/*/unit.json + script/shots.json 에서 자동으로 만든다 (scripts/registry.mjs). 새 편을 여기 손으로 더하지 않는다.
import { UNITS } from "./generated/units";

export const Root: React.FC = () => (
  <>
    <Composition id="ChannelBanner" component={ChannelBanner} durationInFrames={1} fps={30} width={2560} height={1440} />
    <Composition id="ChannelAvatar" component={ChannelAvatar} durationInFrames={1} fps={30} width={800} height={800} />
    {UNITS.map((u) => {
      if ((u.data as any).kind === "long") {
        const ld = u.data as unknown as LongData;
        const tm = ((u as any).timings ?? {}) as Timings;
        return <React.Fragment key={u.id}><Composition id={u.id + "Thumb"} component={LongThumb as React.FC<any>} durationInFrames={1} fps={ld.fps} width={1280} height={720} defaultProps={{ data: ld, code: u.code }} /><Composition id={u.id} component={Long as React.FC<any>} durationInFrames={totalLongFrames(ld, tm)} fps={ld.fps} width={LW} height={LH} defaultProps={{ data: ld, timings: tm, code: u.code }} /></React.Fragment>;
      }
      const data = u.data as unknown as ShotsData;
      return (
        <React.Fragment key={u.id}>
        {data.thumb ? <Composition id={u.id + "Thumb"} component={ThumbStill as React.FC<any>} durationInFrames={1} fps={data.fps} width={W} height={H} defaultProps={{ data, code: u.code }} /> : null}
        <Composition
          id={u.id}
          component={Short as React.FC<any>}
          durationInFrames={totalFrames(data)}
          fps={data.fps}
          width={W}
          height={H}
          defaultProps={{ data, code: u.code }}
        />
        </React.Fragment>
      );
    })}
  </>
);
