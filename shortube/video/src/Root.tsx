import { Composition, Still } from "remotion";
import { ChannelBanner, ChannelIcon } from "./Brand";
import { FPS, H, W } from "./theme";
// 편 목록은 content/*/unit.json 에서 자동으로 만든다 (scripts/registry.mjs). 새 편을 여기 손으로 더하지 않는다.
import { UNITS } from "./generated/units";

type Unit = (typeof UNITS)[number] & { still?: React.FC<any>; stills?: readonly { id: string; props: object }[] };

export const Root: React.FC = () => (
  <>
    {(UNITS as readonly Unit[]).map((u) => (
      <Composition key={u.id} id={u.id} component={u.component} durationInFrames={u.durationInFrames} fps={FPS} width={W} height={H} />
    ))}
    {(UNITS as readonly Unit[]).flatMap((u) =>
      u.still && u.stills ? u.stills.map((s) => <Still key={s.id} id={s.id} component={u.still!} defaultProps={s.props} width={W} height={H} />) : [],
    )}
    <Still id="ChannelIcon" component={ChannelIcon} width={800} height={800} />
    <Still id="ChannelBanner" component={ChannelBanner} width={2560} height={1440} />
  </>
);
