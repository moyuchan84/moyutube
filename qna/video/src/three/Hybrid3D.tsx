// 하이브리드 시제품 — 3D 방 · 서랍 · 플로피디스크 + 2D 가족 그림
// 가족 그림은 3D 판 위에 올리고 꼭짓점을 코드로 휘게 해서 움직인다 (숨쉬기 · 기울기 · 찌그러짐 · 젤리 · 말할 때 통통)
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BlackHanSans";
import { INK, PAPER, RED } from "../theme";
import { Box, Disk, toonRamp } from "./Floppy3D";

const { fontFamily: DISPLAY } = loadDisplay("normal", { weights: ["400"], ignoreTooManyRequestsWarning: true });

export const HYBRID_FRAMES = 240;

const POSES = ["kid/ask", "kid/wow", "kid/laugh", "dad/proud", "dad/explain", "dad/shock", "dad/panic"] as const;
type Pose = (typeof POSES)[number];

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

// 그림 불러오기가 끝날 때까지 렌더를 멈춘다
const usePoseTextures = () => {
  const [handle] = useState(() => delayRender("pose textures"));
  const [tex, setTex] = useState<Record<string, THREE.Texture> | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all(POSES.map((p) => loader.loadAsync(staticFile(`art/common/${p}.webp`)))).then((ts) => {
      const out: Record<string, THREE.Texture> = {};
      ts.forEach((t, i) => {
        t.colorSpace = THREE.NoColorSpace; // 셰이더가 원래 색을 그대로 내보낸다
        t.anisotropy = 8;
        out[POSES[i]] = t;
      });
      setTex(out);
      // 3D 캔버스가 새 그림으로 한 번 그려질 때까지 기다린다
      requestAnimationFrame(() => requestAnimationFrame(() => continueRender(handle)));
    });
  }, [handle]);
  return tex;
};

// 그림 + 흰 스티커 테두리를 한 번에 그리는 셰이더 (휘어도 테두리가 따라온다)
const stickerMaterial = (map: THREE.Texture) =>
  new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, off: { value: new THREE.Vector2(7 / map.image.width, 7 / map.image.height) } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform sampler2D map; uniform vec2 off; varying vec2 vUv;
      void main(){
        vec4 c = texture2D(map, vUv);
        if (c.a > 0.5) { gl_FragColor = vec4(c.rgb, 1.0); return; }
        float a = 0.0;
        for (int i = 0; i < 12; i++) {
          float k = float(i) * 0.5235988;
          a = max(a, texture2D(map, vUv + vec2(cos(k), sin(k)) * off).a);
        }
        if (a > 0.5) gl_FragColor = vec4(1.0); else discard;
      }`,
    transparent: false,
  });

type Rig = {
  x: number; y: number; z: number; // 발 위치
  height: number;
  sy?: number; // 세로 찌그러짐 (1 = 그대로). 가로는 부피가 유지되게 자동
  bend?: number; // 몸 기울기 — 발은 붙고 머리가 휜다
  bob?: number; // 머리 통통 (말할 때)
  breathe?: number;
  flip?: boolean;
};

// 2D 인물 판 — 꼭짓점을 직접 움직여 Live2D 비슷한 몸짓을 낸다
const Character: React.FC<{ tex: THREE.Texture; rig: Rig; camX: number }> = ({ tex, rig, camX }) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, 10, 30);
    g.translate(0, 0.5, 0);
    return g;
  }, []);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  const mat = useMemo(() => stickerMaterial(tex), [tex]);
  const aspect = tex.image.width / tex.image.height;
  const { height: h, sy = 1, bend = 0, bob = 0, breathe = 0 } = rig;
  const sx = 1 / Math.sqrt(sy);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const u = base[i * 3], v = base[i * 3 + 1];
    const head = THREE.MathUtils.smoothstep(v, 0.55, 1);
    const x = u * h * aspect * sx * (rig.flip ? -1 : 1) + bend * v * v * h * 0.22;
    const y = v * h * sy * (1 + breathe * v) + bob * head * h * 0.035;
    pos.setXYZ(i, x, y, 0);
  }
  pos.needsUpdate = true;
  // 카메라 쪽으로 반쯤 돌아 카드처럼 보이게 (완전히 따라 돌면 평평해 보인다)
  const yaw = Math.atan2(camX - rig.x, 24) * 0.6;
  return (
    <group position={[rig.x, rig.y, rig.z]} rotation={[0, yaw, 0]}>
      <mesh geometry={geo} material={mat} frustumCulled={false} />
    </group>
  );
};

// 바닥에 붙는 둥근 그림자 — 점프할수록 작고 옅어진다
export const Shadow: React.FC<{ x: number; z: number; w: number; lift: number }> = ({ x, z, w, lift }) => {
  const k = 1 / (1 + lift * 0.35);
  return (
    <mesh position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[w * k, w * 0.32 * k, 1]}>
      <circleGeometry args={[1, 40]} />
      <meshBasicMaterial color={INK} transparent opacity={0.28 * k} />
    </mesh>
  );
};

export const Room: React.FC<{ drawer: number }> = ({ drawer }) => (
  <group>
    {/* 마루 */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[60, 40]} />
      <meshToonMaterial color="#E2B98A" gradientMap={toonRamp} />
    </mesh>
    {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
      <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
        <planeGeometry args={[0.08, 40]} />
        <meshBasicMaterial color="#C4925F" />
      </mesh>
    ))}
    {/* 벽 · 걸레받이 */}
    <mesh position={[0, 15, -7]}>
      <planeGeometry args={[60, 30]} />
      <meshToonMaterial color="#F3E6CF" gradientMap={toonRamp} />
    </mesh>
    <Box size={[60, 0.6, 0.3]} color="#B98552" position={[0, 0.3, -6.85]} />
    {/* 할머니 집 서랍장 — 맨 위 칸이 열린다 */}
    <group position={[-3.6, 0, -5]}>
      <Box size={[5.2, 6.4, 2.6]} color="#8A5530" position={[0, 3.2, 0]} />
      {[1.2, 3.1].map((y) => (
        <group key={y}>
          <Box size={[4.6, 1.6, 0.2]} color="#B47A48" position={[0, y, 1.35]} />
          <Box size={[0.7, 0.25, 0.25]} color="#E8C66A" position={[0, y, 1.55]} />
        </group>
      ))}
      <group position={[0, 5.1, 1.35 + drawer * 1.8]}>
        <Box size={[4.6, 1.6, 0.2]} color="#B47A48" />
        <Box size={[0.7, 0.25, 0.25]} color="#E8C66A" position={[0, 0, 0.2]} />
        {/* 열린 칸의 바닥 · 옆판 */}
        <Box size={[4.4, 0.15, 2.2]} color="#6E4123" position={[0, -0.7, -1.1]} />
      </group>
    </group>
    {/* 창문 */}
    <group position={[3.6, 9.6, -6.9]}>
      <Box size={[6, 4.2, 0.2]} color="#FFFFFF" />
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[5.4, 3.6]} />
        <meshBasicMaterial color="#BFE6FF" />
      </mesh>
      <Box size={[0.15, 3.6, 0.1]} color="#FFFFFF" position={[0, 0, 0.15]} />
    </group>
  </group>
);

export const CameraRig: React.FC<{ x: number; y: number; z: number; lookY: number; lookX: number }> = ({ x, y, z, lookY, lookX }) => {
  const { camera } = useThree();
  camera.position.set(x, y, z);
  camera.lookAt(lookX, lookY, 0);
  return null;
};

export const Pop: React.FC<{ text: string; at: number; until?: number; x: number; y: number; size: number; rot: number; color?: string; bubble?: boolean }> = ({
  text, at, until = 9999, x, y, size, rot, color = "#FFD43B", bubble,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at || f >= until) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 190 } });
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`,
        fontFamily: DISPLAY, fontSize: size, whiteSpace: "nowrap", lineHeight: 1,
        color: bubble ? INK : color, WebkitTextStroke: bubble ? undefined : `${size * 0.09}px ${INK}`, paintOrder: "stroke fill",
        background: bubble ? "#FFFFFF" : undefined, border: bubble ? `8px solid ${INK}` : undefined,
        borderRadius: bubble ? 60 : undefined, padding: bubble ? "24px 40px" : undefined,
        filter: `drop-shadow(10px 10px 0 ${INK})`,
      }}
    >
      {text}
    </div>
  );
};

// 말할 때 음절처럼 톡톡 튀는 값 (음성이 붙으면 소리 크기로 바꾼다)
export const talk = (f: number, a: number, b: number) => (f >= a && f < b ? Math.max(0, Math.sin((f - a) * 1.25)) * (0.7 + 0.3 * Math.sin(f * 0.37)) : 0);

export const Hybrid3D: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = f / fps;
  const tex = usePoseTextures();

  // ── 아이: 왼쪽에서 폴짝 뛰어 들어와 착지 → 찌그러졌다 젤리처럼 흔들림
  const kJump = ease(f, 0, 22);
  const kx = interpolate(kJump, [0, 1], [-10, -2.3]);
  const kLift = Math.sin(kJump * Math.PI) * 4.5;
  const kLand = f >= 22 ? Math.exp(-(f - 22) / 7) * Math.cos((f - 22) * 0.75) : 0;
  const kHop = f >= 168 && f < 215 ? Math.abs(Math.sin((f - 168) * 0.22)) * 1.2 : 0; // 웃으며 콩콩
  const kHopLand = f >= 168 && f < 215 ? Math.max(0, Math.cos((f - 168) * 0.22 * 2)) * 0.1 : 0;
  const kidPose: Pose = f < 52 ? "kid/ask" : f < 165 ? "kid/wow" : "kid/laugh";
  const kidSwapPop = (at: number) => (f >= at ? Math.exp(-(f - at) / 4) * Math.cos((f - at) * 1.1) * 0.12 : 0);

  // ── 서랍이 열리고 디스크가 튀어나와 가운데로
  const drawer = ease(f, 30, 44);
  const diskFly = ease(f, 44, 70);
  const dx = interpolate(diskFly, [0, 1], [-3.6, 0.1]);
  const dy = interpolate(diskFly, [0, 1], [5.0, 9.4]) + Math.sin(diskFly * Math.PI) * 2.5 + Math.sin(t * 2.4) * 0.18;
  const dz = interpolate(diskFly, [0, 1], [-3.0, 1.0]);
  const shutter = ease(f, 175, 190);
  const diskTurnToDad = ease(f, 100, 115) - ease(f, 150, 160);

  // ── 아빠: 오른쪽에서 미끄러져 들어와 멈춤(몸이 뒤로 휘었다 앞으로) → 설명 → 오답에 쭈그러듦
  const dSlide = spring({ frame: f - 72, fps, config: { damping: 14, stiffness: 120 } });
  const dadX = interpolate(dSlide, [0, 1], [11, 2.5]);
  const dSpeed = f > 72 ? (dadX - interpolate(spring({ frame: f - 73, fps, config: { damping: 14, stiffness: 120 } }), [0, 1], [11, 2.5])) : 0;
  const dadPose: Pose = f < 100 ? "dad/proud" : f < 150 ? "dad/explain" : f < 200 ? "dad/shock" : "dad/panic";
  const wrong = f >= 150 ? Math.exp(-(f - 150) / 6) : 0;
  const deflate = ease(f, 160, 200);
  const shake = f >= 150 && f < 170 ? Math.sin(f * 3.1) * 0.25 * (1 - (f - 150) / 20) : 0;

  // ── 카메라: 천천히 돌며 다가갔다(아빠 쪽) 빠짐 — 3D 방과 2D 인물의 깊이 차이가 보인다
  const camX = interpolate(f, [0, 100, 150, 240], [-2.5, 0, 1.8, -0.6], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const camZ = interpolate(f, [0, 60, 110, 150, 175, 240], [21, 20, 17, 16.5, 20, 21.5], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const lookX = interpolate(f, [0, 100, 150, 240], [-1, 0.3, 1.4, 0], { ...clamp, easing: Easing.inOut(Easing.sin) });

  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {tex && <ThreeCanvas width={width} height={height} flat camera={{ position: [0, 6, 30], fov: 42 }}>
        <CameraRig x={camX} y={5.6} z={camZ} lookX={lookX} lookY={5.6} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 12, 10]} intensity={2.0} />
        <Room drawer={drawer} />
        <group position={[dx, dy, dz]} rotation={[-0.15, (1 - diskFly) * Math.PI * 4 + Math.sin(t * 1.5) * 0.25 + diskTurnToDad * -0.7 + shutter * 0.4, diskFly < 1 ? (1 - diskFly) * 2 : 0]} scale={0.3}>
          <Disk shutter={shutter} split={0} wobble={0} t={t} />
        </group>
        <Shadow x={dx} z={dz} w={1.6} lift={dy} />
        <Shadow x={kx} z={1.4} w={1.7} lift={kLift + kHop} />
        <Shadow x={dadX} z={0} w={2.3} lift={0} />
        {(
          <>
            <Character
              tex={tex[kidPose]}
              camX={camX}
              rig={{
                x: kx, y: kLift + kHop, z: 1.4, height: 6.2,
                sy: 1 - kLand * 0.22 + (kJump < 1 ? (Math.cos(kJump * Math.PI) * -0.12) : 0) - kHopLand + kidSwapPop(52) + kidSwapPop(165) + talk(f, 26, 52) * 0.03,
                bend: kJump < 1 ? -0.35 * Math.sin(kJump * Math.PI) : kLand * 0.5 + Math.sin(t * 1.3) * 0.04,
                bob: talk(f, 26, 52) + talk(f, 168, 215) * 0.8,
                breathe: Math.sin(t * 3.4) * 0.012,
              }}
            />
            <Character
              tex={tex[dadPose]}
              camX={camX}
              rig={{
                x: dadX + shake, y: 0, z: 0, height: 8.6,
                sy: 1 - deflate * 0.16 + wrong * 0.1 * Math.cos((f - 150) * 0.9) + talk(f, 104, 148) * 0.025,
                bend: -dSpeed * 1.8 + (f > 72 && f < 100 ? 0 : 0) + talk(f, 104, 148) * 0.08 - deflate * 0.25 + Math.sin(t * 1.1) * 0.03,
                bob: talk(f, 104, 148),
                breathe: Math.sin(t * 2.6 + 1) * 0.01,
              }}
            />
          </>
        )}
      </ThreeCanvas>}

      {/* 말풍선 · 효과 글자 (2D) */}
      <Pop text="이게 모예요?" at={26} until={95} x={330} y={560} size={84} rot={-4} bubble />
      <Pop text="그건 옛날 초콜릿 틀이지!" at={104} until={150} x={540} y={1700} size={64} rot={3} bubble />
      <Pop text="오답, 하나." at={150} until={205} x={width / 2} y={1640} size={140} rot={-6} color={RED} />
      <Pop text="쑥!" at={36} until={70} x={250} y={900} size={80} rot={-10} color="#9BE7FF" />
      <Pop text="ㅋㅋㅋ" at={170} until={215} x={260} y={820} size={96} rot={-8} color="#FF9F43" />
      <Pop text="이게 모예요?" at={208} x={width / 2} y={250} size={140} rot={-3} />
      {/* 구석 오답 카운터 */}
      {f >= 150 && (
        <div style={{ position: "absolute", right: 50, top: 60, fontFamily: DISPLAY, fontSize: 54, color: INK, background: "#fff", border: `6px solid ${INK}`, borderRadius: 18, padding: "8px 20px" }}>
          오답 <span style={{ color: RED }}>一</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
