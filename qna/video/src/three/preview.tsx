// 3D 시제품만 따로 렌더하는 입구 (편 목록 Root.tsx 와 분리)
// npx remotion render src/three/preview.tsx Floppy3D out/proto/floppy3d.mp4
import { Composition, registerRoot } from "remotion";
import { Floppy3D, FLOPPY_FRAMES } from "./Floppy3D";
import { Hybrid3D, HYBRID_FRAMES } from "./Hybrid3D";
import { HybridRig, HYBRID_RIG_FRAMES } from "./HybridRig";

const PreviewRoot: React.FC = () => (
  <>
    <Composition id="Floppy3D" component={Floppy3D} durationInFrames={FLOPPY_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Hybrid3D" component={Hybrid3D} durationInFrames={HYBRID_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="HybridRig" component={HybridRig} durationInFrames={HYBRID_RIG_FRAMES} fps={30} width={1080} height={1920} />
  </>
);

registerRoot(PreviewRoot);
