import { Composition, Still } from "remotion";
import { RankingShort, TOTAL } from "./RankingShort";
import { Thumbnail } from "./Thumbnail";
import { ChannelBanner, ChannelIcon } from "./Brand";
import { MARKET_TOTAL, MarketShort } from "./market/MarketShort";
import { KPOP_TOTAL, KpopNumbers } from "./kpop/KpopNumbers";
import { DIET_TOTAL, DietNumbers } from "./diet/DietNumbers";
import { HEAT_TOTAL, HeatShort } from "./heat/HeatShort";
import { GTA_TOTAL, GtaShort } from "./gta/GtaShort";
import { SUNEUNG_TOTAL, SuneungShort } from "./suneung/SuneungShort";
import { US_TOTAL, UsShort } from "./usmarket/UsShort";
import { BACKTEST_TOTAL, BacktestShort } from "./backtest/BacktestShort";
import { SEOUL_TOTAL, SeoulSupplyShort } from "./seoulsupply/SeoulSupplyShort";
import { SOXL_TOTAL, SoxlShort } from "./soxl/SoxlShort";
import { FPS, H, W } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition id="RankingShort" component={RankingShort} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    {(["comeback", "swap", "longrun"] as const).map((v) => (
      <Still key={v} id={`Thumb-${v}`} component={Thumbnail} defaultProps={{ variant: v }} width={W} height={H} />
    ))}
    <Composition id="MarketShort" component={MarketShort} durationInFrames={MARKET_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="KpopNumbers" component={KpopNumbers} durationInFrames={KPOP_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="DietNumbers" component={DietNumbers} durationInFrames={DIET_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="HeatShort" component={HeatShort} durationInFrames={HEAT_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="GtaShort" component={GtaShort} durationInFrames={GTA_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="SuneungShort" component={SuneungShort} durationInFrames={SUNEUNG_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="UsShort" component={UsShort} durationInFrames={US_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="BacktestShort" component={BacktestShort} durationInFrames={BACKTEST_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="SeoulSupplyShort" component={SeoulSupplyShort} durationInFrames={SEOUL_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="SoxlShort" component={SoxlShort} durationInFrames={SOXL_TOTAL} fps={FPS} width={W} height={H} />
    <Still id="ChannelIcon" component={ChannelIcon} width={800} height={800} />
    <Still id="ChannelBanner" component={ChannelBanner} width={2560} height={1440} />
  </>
);
