// 하이브리드 2차 — 3D 방 + 관절 인형(잘라 낸 2D 그림). 걷기 · 점프 · 손짓 · 놀람이 관절로 움직인다
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BlackHanSans";
import { INK, PAPER, RED } from "../theme";
import { Disk } from "./Floppy3D";
import { CameraRig, clamp, ease, Pop, Room, Shadow, talk } from "./Hybrid3D";
import { RigCharacter, useRigTextures } from "./Rig";

const { fontFamily: DISPLAY } = loadDisplay("normal", { weights: ["400"], ignoreTooManyRequestsWarning: true });

export const HYBRID_RIG_FRAMES = 240;

const MOUTHS = ["mouth-a", "mouth-e", "mouth-o", "mouth-e", "mouth-a", "apose"];
// 말하는 구간에서 3프레임마다 입 모양을 바꾼다 (가끔 닫힘)
const lip = (f: number, a: number, b: number) => (f >= a && f < b ? MOUTHS[(Math.floor((f - a) / 3) * 7 + Math.floor((f - a) / 11)) % MOUTHS.length] : null);
const blink = (f: number, at: number[]) => (at.some((a) => f >= a && f < a + 4) ? "blink" : null);

export const HybridRig: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = f / fps;
  const tex = useRigTextures(["kid", "dad"]);

  // ── 아이: 폴짝 뛰어 들어옴 (공중에서 다리 접고, 착지하며 무릎 굽힘)
  const kJump = ease(f, 0, 22);
  const kx = interpolate(kJump, [0, 1], [-10, -2.3]);
  const kAir = Math.sin(kJump * Math.PI);
  const kLand = f >= 22 ? Math.exp(-(f - 22) / 6) * Math.cos((f - 22) * 0.8) : 0;
  const kHopPhase = f >= 168 && f < 215 ? (f - 168) * 0.3 : 0;
  const kHop = f >= 168 && f < 215 ? Math.abs(Math.sin(kHopPhase)) * 0.9 : 0;
  const kTalk = talk(f, 26, 52);

  // ── 서랍 · 디스크
  const drawer = ease(f, 30, 44);
  const diskFly = ease(f, 44, 70);
  const dx = interpolate(diskFly, [0, 1], [-3.6, 0.1]);
  const dy = interpolate(diskFly, [0, 1], [5.0, 9.4]) + Math.sin(diskFly * Math.PI) * 2.5 + Math.sin(t * 2.4) * 0.18;
  const dz = interpolate(diskFly, [0, 1], [-3.0, 1.0]);
  const shutter = ease(f, 175, 190);
  const diskTurnToDad = ease(f, 100, 115) - ease(f, 150, 160);

  // ── 아빠: 걸어 들어옴(다리 · 팔 번갈아) → 손가락 들며 설명 → 오답에 두 팔 번쩍 → 축 처짐
  const walk = interpolate(f, [72, 100], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const dadX = interpolate(walk, [0, 1], [10, 2.5]);
  const walking = f >= 72 && f < 100 ? 1 - Math.pow(walk, 3) : 0;
  const ph = (f - 72) * 0.42;
  const explain = ease(f, 100, 110) - ease(f, 148, 154);
  const shock = ease(f, 150, 156) - ease(f, 196, 210);
  const droop = ease(f, 196, 215);
  const tremble = shock > 0.5 ? Math.sin(f * 2.7) * 0.05 : 0;
  const dTalk = talk(f, 104, 148);

  // ── 얼굴: 말할 땐 입 모양을 음절처럼 바꾸고(음성이 붙으면 소리 크기로), 가끔 눈을 깜빡인다
  const kLook = f >= 52 && f < 100 ? 1 : 0;
  const kPoint = ease(f, 50, 58) - ease(f, 92, 100);
  const kLaugh = ease(f, 165, 172);
  const kidFace = f >= 165 ? "laugh" : lip(f, 26, 52) ?? (f >= 52 && f < 100 ? "mouth-o" : f >= 150 && f < 165 ? "shock" : blink(f, [12, 118, 140]) ?? "apose");
  const dadFace = f >= 196 ? "panic" : f >= 150 ? "shock" : lip(f, 104, 148) ?? (f >= 72 && f < 104 ? "smug" : blink(f, [125]) ?? "apose");

  // ── 카메라
  const camX = interpolate(f, [0, 100, 150, 240], [-2.5, 0, 1.8, -0.6], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const camZ = interpolate(f, [0, 60, 110, 150, 175, 240], [21, 20, 17, 16.5, 20, 21.5], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const lookX = interpolate(f, [0, 100, 150, 240], [-1, 0.3, 1.4, 0], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const yaw = (x: number) => Math.atan2(camX - x, 24) * 0.6;

  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {tex && (
        <ThreeCanvas width={width} height={height} flat camera={{ position: [0, 6, 30], fov: 42 }}>
          <CameraRig x={camX} y={5.6} z={camZ} lookX={lookX} lookY={5.6} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[6, 12, 10]} intensity={2.0} />
          <Room drawer={drawer} />
          <group position={[dx, dy, dz]} rotation={[-0.15, (1 - diskFly) * Math.PI * 4 + Math.sin(t * 1.5) * 0.25 + diskTurnToDad * -0.7 + shutter * 0.4, diskFly < 1 ? (1 - diskFly) * 2 : 0]} scale={0.3}>
            <Disk shutter={shutter} split={0} wobble={0} t={t} />
          </group>
          <Shadow x={dx} z={dz} w={1.6} lift={dy} />
          <Shadow x={kx} z={1.4} w={1.7} lift={kAir * 4.5 + kHop} />
          <Shadow x={dadX} z={0} w={2.3} lift={0} />

          <RigCharacter
            name="kid" tex={tex} height={6.4} x={kx} y={kAir * 4.5 + kHop} z={1.4} yaw={yaw(kx)}
            pose={{
              face: kidFace,
              squash: 1 - kLand * 0.18 - (kHop < 0.15 && f >= 168 && f < 215 ? 0.06 : 0),
              hipY: -kLand * 0.25,
              torso: -kAir * 0.15 + kLand * 0.1 + Math.sin(t * 1.4) * 0.03 + Math.sin(kHopPhase * 2) * 0.06,
              head: kTalk * 0.1 + Math.sin(t * 2) * 0.04 + kLook * 0.12 + Math.sin(kHopPhase * 2 + 0.6) * 0.12,
              // 팔: 평소엔 몸 옆으로 내리고, 점프 땐 위로 휙, 디스크가 날 땐 오른팔로 가리킴, 웃을 땐 배를 잡듯 안으로
              armL: 0.3 - kAir * 1.2 + kLand * 0.2 - kLaugh * 0.1 + Math.sin(t * 2.1) * 0.03,
              foreL: kAir * 0.5 + kLaugh * 1.1,
              armR: -0.3 + kAir * 1.2 + kPoint * 2.6 + kLaugh * 0.1 + Math.sin(t * 2.1 + 1) * 0.03,
              foreR: -kAir * 0.5 + kPoint * 0.15 - kLaugh * 1.1,
              legL: kAir * 0.5 + Math.sin(kHopPhase * 2) * 0.12,
              legR: -kAir * 0.35 - Math.sin(kHopPhase * 2) * 0.12,
            }}
          />
          <RigCharacter
            name="dad" tex={tex} height={8.8} x={dadX + tremble} y={0} z={0} yaw={yaw(dadX)}
            pose={{
              face: dadFace,
              hipY: walking * Math.abs(Math.cos(ph)) * 0.18 - droop * 0.15,
              squash: 1 - droop * 0.05,
              torso: walking * 0.05 + Math.sin(t * 1.1) * 0.02 + dTalk * 0.03 - shock * 0.05 + droop * 0.08,
              head: dTalk * 0.08 * Math.sin(f * 0.6) + explain * 0.06 - shock * 0.1 + droop * 0.18 + Math.sin(t * 1.7) * 0.03,
              // 걸을 땐 팔꿈치를 살짝 굽혀 앞뒤로, 설명할 땐 오른팔을 들고 팔꿈치를 꺾어 검지를 위로, 오답엔 만세, 그 뒤 축
              armL: 0.32 + walking * Math.sin(ph) * 0.3 - shock * 2.4 + tremble * 2 + droop * 0.05 + Math.sin(t * 1.9) * 0.02,
              foreL: walking * (0.25 + Math.sin(ph) * 0.15) - shock * 0.5,
              armR: -0.32 - walking * Math.sin(ph) * 0.3 + explain * (1.15 + dTalk * 0.12) + shock * 2.4 - tremble * 2 - droop * 0.05,
              foreR: -walking * (0.25 - Math.sin(ph) * 0.15) + explain * (1.45 + Math.sin(f * 0.5) * dTalk * 0.2) + shock * 0.5,
              legL: walking * Math.sin(ph) * 0.3,
              legR: -walking * Math.sin(ph) * 0.3,
            }}
          />
        </ThreeCanvas>
      )}
      <Pop text="이게 모예요?" at={26} until={95} x={330} y={560} size={84} rot={-4} bubble />
      <Pop text="그건 옛날 초콜릿 틀이지!" at={104} until={150} x={540} y={1700} size={64} rot={3} bubble />
      <Pop text="오답, 하나." at={150} until={205} x={width / 2} y={1640} size={140} rot={-6} color={RED} />
      <Pop text="쑥!" at={36} until={70} x={250} y={900} size={80} rot={-10} color="#9BE7FF" />
      <Pop text="ㅋㅋㅋ" at={170} until={215} x={260} y={820} size={96} rot={-8} color="#FF9F43" />
      <Pop text="이게 모예요?" at={208} x={width / 2} y={250} size={140} rot={-3} />
      {f >= 150 && (
        <div style={{ position: "absolute", right: 50, top: 60, fontFamily: DISPLAY, fontSize: 54, color: INK, background: "#fff", border: `6px solid ${INK}`, borderRadius: 18, padding: "8px 20px" }}>
          오답 <span style={{ color: RED }}>一</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
