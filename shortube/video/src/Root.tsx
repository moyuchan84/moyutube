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
import { FRANCE_TOTAL, FranceShort } from "./france/FranceShort";
import { TAX_TOTAL, TaxShort } from "./tax/TaxShort";
import { DIAL_TOTAL, DialShort } from "./dial/DialShort";
import { BODY_TOTAL, BodyShort } from "./body/BodyShort";
import { BILLBOARD_TOTAL, BillboardShort } from "./billboard/BillboardShort";
import { WHYDROP_TOTAL, WhyDropShort } from "./whydrop/WhyDropShort";
import { NETWORTH_TOTAL, NetWorthShort } from "./networth/NetWorthShort";
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
    <Composition id="FranceShort" component={FranceShort} durationInFrames={FRANCE_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="TaxShort" component={TaxShort} durationInFrames={TAX_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="DialShort" component={DialShort} durationInFrames={DIAL_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="BodyShort" component={BodyShort} durationInFrames={BODY_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="BillboardShort" component={BillboardShort} durationInFrames={BILLBOARD_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="WhyDropShort" component={WhyDropShort} durationInFrames={WHYDROP_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="NetWorthShort" component={NetWorthShort} durationInFrames={NETWORTH_TOTAL} fps={FPS} width={W} height={H} />
    <Still id="ChannelIcon" component={ChannelIcon} width={800} height={800} />
    <Still id="ChannelBanner" component={ChannelBanner} width={2560} height={1440} />
  </>
);
