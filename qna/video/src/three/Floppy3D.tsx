// 「이게 모예요?」 3D 물건 시제품 — 코드로 만든 플로피디스크 (툰 셰이딩 + 검은 외곽선)
// 0~1초 회전하며 등장 → 앞면 → 쇠 덧문이 열림 → 껍데기가 갈라지고 안의 말랑한 원판이 흐물흐물
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BlackHanSans";
import { INK, PAPER } from "../theme";

const { fontFamily: DISPLAY } = loadDisplay("normal", { weights: ["400"], ignoreTooManyRequestsWarning: true });

// 1 = 10mm. 3.5인치 디스크는 90 × 94 × 3.3mm
const W = 9, H = 9.4, T = 0.33;
const LINE = 0.07; // 외곽선 두께

export const toonRamp = (() => {
  const data = new Uint8Array([90, 90, 90, 255, 190, 190, 190, 255, 255, 255, 255, 255]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
})();

const Toon: React.FC<{ color: string }> = ({ color }) => <meshToonMaterial color={color} gradientMap={toonRamp} />;

// 상자 + 뒤집은 껍데기 외곽선
export const Box: React.FC<{ size: [number, number, number]; color: string; position?: [number, number, number] }> = ({ size, color, position }) => (
  <group position={position}>
    <mesh>
      <boxGeometry args={size} />
      <Toon color={color} />
    </mesh>
    <mesh>
      <boxGeometry args={[size[0] + LINE * 2, size[1] + LINE * 2, size[2] + LINE * 2]} />
      <meshBasicMaterial color={INK} side={THREE.BackSide} />
    </mesh>
  </group>
);

// 껍데기 반쪽 (앞 · 뒤). front 면 라벨 · 덧문 홈, 아니면 가운데 쇠 허브
export const Shell: React.FC<{ front: boolean }> = ({ front }) => {
  const s = front ? 1 : -1;
  const face = (T / 2) * s + 0.006 * s;
  return (
    <group>
      <Box size={[W, H, T / 2]} color="#2F4F8F" />
      {front ? (
        <>
          {/* 라벨 — 상표 없이 빈 종이에 손글씨 줄만 */}
          <mesh position={[0, -1.9, face]}>
            <planeGeometry args={[7.2, 4.9]} />
            <Toon color="#FBF7EC" />
          </mesh>
          {[-0.9, -1.9, -2.9].map((y) => (
            <mesh key={y} position={[-0.4, y, face + 0.004]}>
              <planeGeometry args={[5.6, 0.07]} />
              <meshBasicMaterial color="#9DB4D8" />
            </mesh>
          ))}
          <mesh position={[-1.2, -0.95, face + 0.008]} rotation={[0, 0, 0.04]}>
            <planeGeometry args={[3.2, 0.16]} />
            <meshBasicMaterial color={INK} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 0, face]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.04, 48]} />
          <Toon color="#C9CED6" />
        </mesh>
      )}
      {/* 덧문 아래 원판이 보이는 홈 */}
      <mesh position={[0, 2.55, face]}>
        <planeGeometry args={[1.25, 3.3]} />
        <meshBasicMaterial color="#3A2416" />
      </mesh>
      {/* 쓰기 방지 구멍 */}
      <mesh position={[-3.9 * s, -4.05, face]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshBasicMaterial color="#111A22" />
      </mesh>
    </group>
  );
};

// 안의 원판 — 링 메시의 꼭짓점을 프레임마다 물결처럼 휘게 한다
export const SoftDisk: React.FC<{ wobble: number; t: number }> = ({ wobble, t }) => {
  const geo = useMemo(() => new THREE.RingGeometry(0.6, 4.3, 64, 12), []);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1];
    const r = Math.hypot(x, y) / 4.3;
    pos.setZ(i, wobble * r * r * (Math.sin(x * 0.7 + t * 6) * 0.9 + Math.cos(y * 0.6 - t * 4.5) * 0.6));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return (
    <group>
      <mesh geometry={geo}>
        <meshToonMaterial color="#6B3E22" gradientMap={toonRamp} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[1.1, 48]} />
        <meshBasicMaterial color="#C9CED6" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export const Disk: React.FC<{ shutter: number; split: number; wobble: number; t: number }> = ({ shutter, split, wobble, t }) => (
  <group>
    <group position={[-split * 1.6, split * 4.4, T / 4 + split * 1.2]} rotation={[-split * 0.45, 0, split * 0.12]}>
      <Shell front />
    </group>
    <group position={[split * 1.8, -split * 4.6, -T / 4 - split * 1.2]} rotation={[split * 0.4, 0, -split * 0.1]}>
      <Shell front={false} />
    </group>
    <group position={[0, split * 0.2, split * 1.5]} rotation={[-split * 0.15, split * 0.3, 0]} scale={0.98 + split * 0.2}>
      <SoftDisk wobble={wobble} t={t} />
    </group>
    {/* 쇠 덧문 — 앞뒤를 감싸고 오른쪽으로 미끄러진다. 껍데기가 갈라지면 앞쪽과 함께 뜬다 */}
    <group position={[0.4 + shutter * 2.3 - split * 1.6, 2.75 + split * 4.4, split * 1.2 + T / 4]} rotation={[-split * 0.45, 0, split * 0.12]}>
      <Box size={[5.2, 3.9, T + 0.08]} color="#D7DCE3" />
      <mesh position={[-0.9, 0.2, (T + 0.08) / 2 + 0.006]}>
        <planeGeometry args={[1.25, 2.6]} />
        <meshBasicMaterial color="#AEB6C2" />
      </mesh>
    </group>
  </group>
);

const Word: React.FC<{ text: string; at: number; x: number; y: number; size: number; rot: number; color?: string; bubble?: boolean }> = ({
  text, at, x, y, size, rot, color = "#FFD43B", bubble,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 180 } });
  const shadow = `drop-shadow(0 0 0 ${INK})`;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`,
        fontFamily: DISPLAY, fontSize: size, whiteSpace: "nowrap", lineHeight: 1,
        color: bubble ? INK : color, WebkitTextStroke: bubble ? undefined : `${size * 0.09}px ${INK}`, paintOrder: "stroke fill",
        background: bubble ? "#FFFFFF" : undefined, border: bubble ? `8px solid ${INK}` : undefined,
        borderRadius: bubble ? 60 : undefined, padding: bubble ? "26px 44px" : undefined,
        filter: `${shadow} drop-shadow(10px 10px 0 ${INK})`,
      }}
    >
      {text}
    </div>
  );
};

export const FLOPPY_FRAMES = 150;

export const Floppy3D: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = f / fps;

  const enter = spring({ frame: f, fps, config: { damping: 11, stiffness: 90 } });
  const shutter = interpolate(f, [62, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const split = spring({ frame: f - 98, fps, config: { damping: 12, stiffness: 70 } });
  const wobble = interpolate(f, [100, 116], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 등장하며 한 바퀴 반 → 앞면에서 살짝 흔들 → 갈라질 때 비스듬히
  const spinY = (1 - enter) * Math.PI * 3 + Math.sin(t * 1.6) * 0.18 - split * 0.35;
  const tiltX = -0.18 + Math.sin(t * 1.1) * 0.05 + split * 0.12;
  const bob = Math.sin(t * 2.2) * 0.15;
  const scale = (0.4 + enter * 0.6) * 0.74;

  const kidIn = spring({ frame: f - 18, fps, config: { damping: 12, stiffness: 140 } });
  const breathe = 1 + Math.sin(t * 3.2) * 0.012;

  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {/* 집중선 배경 */}
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${t * 8}deg at 50% 40%, #FFE9A8 0deg 7deg, ${PAPER} 7deg 14deg)` }} />
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 30], fov: 35 }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[6, 8, 10]} intensity={2.2} />
        <group position={[0, 1.6 + bob, 0]} rotation={[tiltX, spinY, 0]} scale={scale}>
          <Disk shutter={shutter} split={split} wobble={wobble} t={t} />
        </group>
      </ThreeCanvas>

      {/* 2D 캐릭터와 섞기 — 공통 컷인 스티커 */}
      <Img
        src={staticFile("art/common/cutin/kid-ask.webp")}
        style={{
          position: "absolute", left: -30, bottom: 60, height: 560,
          transform: `translateX(${(1 - kidIn) * -600}px) scale(${breathe}) rotate(-4deg)`, transformOrigin: "50% 100%",
          filter: `drop-shadow(7px 0 0 #fff) drop-shadow(-7px 0 0 #fff) drop-shadow(0 7px 0 #fff) drop-shadow(0 -7px 0 #fff) drop-shadow(12px 12px 0 ${INK})`,
        }}
      />
      {f < 100 && <Word text="이게 모예요?" at={20} x={640} y={1290} size={92} rot={-4} bubble />}
      {f < 100 && <Word text="스르륵~" at={64} x={820} y={560} size={110} rot={8} color="#9BE7FF" />}
      {f >= 96 && <Word text="흐물흐물~" at={104} x={300} y={780} size={120} rot={-6} color="#FF9F43" />}
      <Word text="플로피디스크" at={40} x={width / 2} y={170} size={130} rot={-3} />
    </AbsoluteFill>
  );
};
