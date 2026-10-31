// 「이게 모예요?」 물건 3D 장면 — 모션 편집(Motion.tsx)의 샷에 `three: { scene, … }` 로 얹는 투명 3D 레이어.
// 장면은 샷 안의 프레임(f)만 보고 움직인다. 1920×1080, 배경은 투명 (샷의 bg 가 뒤에 깔린다).
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { INK } from "../theme";
import { Box, Shell, SoftDisk, toonRamp } from "./Floppy3D";

export type ThreeShot = { scene: string; step?: number; x?: number; y?: number; scale?: number };

const FPS = 30;
const T = 0.33; // 3.5인치 디스크 두께 (1 = 10mm)
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const pop = (f: number, at = 0, damping = 11) => spring({ frame: f - at, fps: FPS, config: { damping, stiffness: 120 } });
const Toon: React.FC<{ color: string; side?: THREE.Side }> = ({ color, side }) => <meshToonMaterial color={color} gradientMap={toonRamp} side={side} />;

// 원판을 닦는 천(라이너) — 얇은 흰 고리
const Liner: React.FC<{ z: number; open: number; dir: number }> = ({ z, open, dir }) => (
  <mesh position={[dir * open * 7.5, -dir * open * 1.2, z]} scale={1 - open * 0.25}>
    <ringGeometry args={[0.9, 4.3, 48]} />
    <meshToonMaterial color="#F4F1EA" gradientMap={toonRamp} side={THREE.DoubleSide} transparent opacity={0.7} />
  </mesh>
);

// 3.5인치 디스크를 부품별로: 껍데기 앞 · 뒤, 덧문, 천 두 장, 원판. explode 0~4 단계로 하나씩 떨어져 나온다
const Exploded: React.FC<{ f: number; step: number; t: number }> = ({ f, step, t }) => {
  // 앞 단계까지는 이미 벌어진 상태, 이번 단계만 샷 처음 18프레임 동안 벌어진다
  const k = (n: number) => (step > n ? 1 : step === n ? ease(f, 2, 20) : 0);
  const shell = k(1), shutter = k(2), liner = k(3), disk = k(4);
  return (
    <group>
      <group position={[-shell * 1.2, shell * 5.2, T / 4 + shell * 1.4]} rotation={[-shell * 0.5, 0, shell * 0.12]}>
        <Shell front />
      </group>
      <group position={[shell * 1.2, -shell * 5.2, -T / 4 - shell * 1.4]} rotation={[shell * 0.45, 0, -shell * 0.12]}>
        <Shell front={false} />
      </group>
      {/* 덧문: 앞 껍데기와 같이 뜨다가 2단계에서 오른쪽으로 휙 */}
      <group position={[0.4 + shutter * 7.5 - shell * 1.2 * (1 - shutter), 2.75 + shell * 5.2 * (1 - shutter) + shutter * 1.5, T / 4 + shell * 1.4 + shutter * 1.5]} rotation={[-shell * 0.5 * (1 - shutter), shutter * 0.6, shutter * -0.3]}>
        <Box size={[5.2, 3.9, T + 0.08]} color="#D7DCE3" />
      </group>
      <group position={[0, 0, 0]} rotation={[-0.15 * (shell + disk), 0.25 * disk, 0]}>
        <Liner z={0.06 + liner * 0.8} open={liner} dir={-1} />
        <Liner z={-0.06 - liner * 0.8} open={liner} dir={1} />
        <group scale={1 + disk * 0.12}>
          <SoftDisk wobble={disk * 0.6} t={t} />
        </group>
      </group>
    </group>
  );
};

// 접히는 옛 8 · 5.25인치 디스크: 검은 종이 봉투 + 가운데 구멍 + 읽는 창
const FloppyEnvelope: React.FC<{ size: number; bend: number; t: number; color?: string }> = ({ size, bend, t, color = "#1E1E22" }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(size, size, 24, 24), [size]);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1];
    pos.setZ(i, bend * (Math.pow(x / size, 2) * size * 0.7 + Math.sin(y / size * 3 + t * 5) * 0.25));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return (
    <group>
      <mesh geometry={geo}>
        <meshToonMaterial color={color} gradientMap={toonRamp} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.02 + bend * 0.05]}>
        <ringGeometry args={[size * 0.07, size * 0.11, 32]} />
        <meshBasicMaterial color="#8C6A4A" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -size * 0.27, 0.02 + bend * 0.2]}>
        <planeGeometry args={[size * 0.06, size * 0.22]} />
        <meshBasicMaterial color="#6B4A2E" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-size * 0.18, size * 0.33, 0.02 + bend * 0.1]}>
        <planeGeometry args={[size * 0.45, size * 0.14]} />
        <meshBasicMaterial color="#F2EEE3" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// 단단한 3.5인치 (덧문 · 라벨까지) — 앞뒤 껍데기를 붙여 놓은 것
const Floppy35: React.FC<{ shutter?: number; color?: string }> = ({ shutter = 0 }) => (
  <group>
    <group position={[0, 0, T / 4]}><Shell front /></group>
    <group position={[0, 0, -T / 4]}><Shell front={false} /></group>
    <group position={[0.4 + shutter * 2.3, 2.75, 0]}>
      <Box size={[5.2, 3.9, T + 0.08]} color="#D7DCE3" />
    </group>
  </group>
);

// 무지개 빛이 도는 CD
const Cd: React.FC = () => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[6, 6, 0.12, 64]} />
      <meshStandardMaterial color="#DCE3EA" metalness={0.9} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0, 0.07]}>
      <ringGeometry args={[1.6, 5.9, 64]} />
      <meshBasicMaterial color="#C9E6FF" transparent opacity={0.45} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0, 0.08]}>
      <ringGeometry args={[2.6, 4.6, 64, 1, 0.3, 1.4]} />
      <meshBasicMaterial color="#FFB6E1" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0, 0.09]}>
      <circleGeometry args={[0.75, 32]} />
      <meshBasicMaterial color="#2A2A2E" side={THREE.DoubleSide} />
    </mesh>
  </group>
);

// USB 메모리
const Usb: React.FC = () => (
  <group>
    <Box size={[2.2, 5.2, 0.9]} color="#E85D4A" />
    <Box size={[1.6, 1.6, 0.6]} color="#C9CED6" position={[0, 3.4, 0]} />
    <Box size={[0.9, 0.35, 0.65]} color="#3A3F48" position={[0, 3.6, 0]} />
  </group>
);

// 휴대폰
const Phone: React.FC = () => (
  <group>
    <Box size={[4.6, 9.4, 0.5]} color="#2A2D34" />
    <mesh position={[0, 0, 0.26]}>
      <planeGeometry args={[4.1, 8.6]} />
      <meshBasicMaterial color="#7FC8F8" />
    </mesh>
  </group>
);

const Lights: React.FC = () => (
  <>
    <ambientLight intensity={1.15} />
    <directionalLight position={[6, 10, 12]} intensity={2.1} />
  </>
);

// 「모 아니면 도」 윷가락 하나: 둥근 등(진한 나무) + 납작한 배(밝은 나무, X 표시). turn 0 = 등이 앞, π = 배가 앞
const YUT_L = 7.2;
const YUT_R = 0.75;
const YutStick: React.FC<{ turn: number }> = ({ turn }) => (
  <group rotation={[0, turn, 0]}>
    <mesh>
      <cylinderGeometry args={[YUT_R, YUT_R, YUT_L, 24, 1, false, -Math.PI / 2, Math.PI]} />
      <Toon color="#B9773E" side={THREE.DoubleSide} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[YUT_R + 0.09, YUT_R + 0.09, YUT_L + 0.18, 24, 1, false, -Math.PI / 2, Math.PI]} />
      <meshBasicMaterial color={INK} side={THREE.BackSide} />
    </mesh>
    <Box size={[YUT_R * 2, YUT_L, 0.06]} color="#F1D9A8" position={[0, 0, -0.03]} />
    {[-1.6, 1.6].map((y) =>
      [0.6, -0.6].map((r) => (
        <mesh key={`${y}${r}`} position={[0, y, -0.08]} rotation={[0, 0, r]}>
          <boxGeometry args={[0.12, 1.1, 0.02]} />
          <meshBasicMaterial color={INK} />
        </mesh>
      )),
    )}
  </group>
);

// 윷 네 개를 던진다. step 0 = 하늘에서 빙글빙글 (선택 화면용, 결과 없음) · 1 = 모 (넷 다 등) · 2 = 도 (하나만 배)
const Yut: React.FC<{ f: number; step: number }> = ({ f, step }) => {
  const t = f / FPS;
  const land = step ? ease(f, 10, 34) : 0;
  return (
    <group>
      {[0, 1, 2, 3].map((i) => {
        const x0 = (i - 1.5) * 2.2;
        const fly = interpolate(f, [0, 14], [-14, 1.5], { ...clamp, easing: Easing.out(Easing.cubic) });
        const hover = Math.sin(t * 2 + i) * 0.6;
        const air = { x: x0 * 1.5 + Math.sin(t * 1.3 + i * 2) * 0.8, y: fly + hover + (i % 2 ? 1.2 : -0.6), rz: t * (2.2 + i * 0.4) * (i % 2 ? 1 : -1) + i, ry: t * (6 + i) };
        const final = step === 2 && i === 2 ? Math.PI : 0;
        const bounce = step ? Math.abs(Math.sin(interpolate(f, [34, 52], [0, Math.PI * 2], clamp))) * interpolate(f, [34, 52], [0.8, 0], clamp) : 0;
        const x = air.x + (x0 - air.x) * land;
        const y = air.y + (-1 + bounce - air.y) * land;
        const rz = air.rz * (1 - land) + (i - 1.5) * 0.05 * land;
        const ry = air.ry * (1 - land) + (final + Math.round(air.ry / (2 * Math.PI)) * 2 * Math.PI) * land;
        return (
          <group key={i} position={[x, y, 0]} rotation={[0, 0, rz]}>
            <YutStick turn={ry} />
          </group>
        );
      })}
    </group>
  );
};

const Scene: React.FC<{ shot: ThreeShot; f: number }> = ({ shot, f }) => {
  const t = f / FPS;
  const step = shot.step ?? 0;
  switch (shot.scene) {
    case "yut":
      return (
        <group rotation={[-0.15, 0, 0]} scale={1.1}>
          <Yut f={f} step={step} />
        </group>
      );
    // 주인공 디스크가 빙글 돌며 등장 → 천천히 흔들림. step 1 이면 덧문이 열린다
    case "floppy": {
      const k = pop(f);
      return (
        <group rotation={[-0.2 + Math.sin(t * 1.1) * 0.05, (1 - k) * Math.PI * 3 + Math.sin(t * 1.4) * 0.3, 0]} scale={0.3 + k * 0.7}>
          <Floppy35 shutter={step ? ease(f, 6, 22) : 0} />
        </group>
      );
    }
    case "explode":
      return (
        <group rotation={[-0.25, -0.5 + Math.sin(t * 0.8) * 0.12, 0]} scale={0.95}>
          <Exploded f={f} step={step} t={t} />
        </group>
      );
    // 원판이 돌고 작은 자석 머리가 지나간 자리에 N(빨강) · S(파랑) 점이 찍힌다
    case "write": {
      const spin = t * 5;
      const dots = 28;
      const drawn = Math.floor(interpolate(f, [6, 6 + dots * 2], [0, dots], clamp));
      return (
        <group rotation={[-1.0, 0, 0]} scale={1.15}>
          <group rotation={[0, 0, spin]}>
            <mesh>
              <ringGeometry args={[0.9, 5.2, 64]} />
              <Toon color="#6B3E22" side={THREE.DoubleSide} />
            </mesh>
            {Array.from({ length: drawn }).map((_, i) => {
              const a = (i / dots) * Math.PI * 2;
              const n = (i * 7 + 3) % 5 < 3; // N · S 가 섞인 고정 무늬
              return (
                <mesh key={i} position={[Math.cos(a) * 3.6, Math.sin(a) * 3.6, 0.08]}>
                  <circleGeometry args={[0.28, 16]} />
                  <meshBasicMaterial color={n ? "#E63946" : "#2F80ED"} side={THREE.DoubleSide} />
                </mesh>
              );
            })}
          </group>
          <mesh position={[0, 0, 0.05]}>
            <circleGeometry args={[0.9, 32]} />
            <meshBasicMaterial color="#C9CED6" side={THREE.DoubleSide} />
          </mesh>
          {/* 머리 + 팔 */}
          <group position={[3.6, 0, 0.5 + Math.sin(t * 12) * 0.04]}>
            <Box size={[0.9, 0.7, 0.5]} color="#3A3F48" />
            <Box size={[5, 0.35, 0.25]} color="#9AA3AE" position={[2.8, 0, 0.1]} />
          </group>
        </group>
      );
    }
    // 1971년 큰 디스크가 흐물흐물
    case "bend8": {
      const k = pop(f);
      return (
        <group rotation={[-0.35, 0.35, 0]} scale={0.4 + 0.6 * k}>
          <FloppyEnvelope size={11} bend={0.25 + Math.sin(t * 3) * 0.25} t={t} />
        </group>
      );
    }
    // 8 → 5.25 → 3.5인치가 차례로 나란히
    case "sizes": {
      const a = pop(f, 0), b = pop(f, 12), c = pop(f, 24);
      return (
        <group rotation={[-0.15, 0, 0]} position={[0, -0.5, 0]}>
          <group position={[-8.5, 0.6, 0]} scale={a}><FloppyEnvelope size={9.6} bend={0.05} t={t} /></group>
          <group position={[1.4, -0.4, 0]} scale={b}><FloppyEnvelope size={6.3} bend={0.03} t={t} color="#26262B" /></group>
          <group position={[8.6, -1.1, 0]} scale={c * 0.48} rotation={[0, Math.sin(t * 1.5) * 0.2, 0]}><Floppy35 /></group>
        </group>
      );
    }
    // 플로피 → CD → USB 메모리 (step 0: 플로피와 CD, step 1: USB 까지)
    case "evolution": {
      const a = pop(f, 0), b = step ? 1 : pop(f, 6), c = step ? pop(f, 4) : 0;
      return (
        <group rotation={[-0.2, 0, 0]}>
          <group position={[-8, 0, 0]} scale={0.45 * a} rotation={[0, Math.sin(t) * 0.3, 0]}><Floppy35 /></group>
          <group position={[0, 0, 0]} scale={0.75 * b} rotation={[0, Math.sin(t * 1.3) * 0.5, t * 0.6]}><Cd /></group>
          <group position={[8, 0, 0]} scale={0.8 * c} rotation={[0.2, Math.sin(t * 1.6) * 0.5, 0.2]}><Usb /></group>
        </group>
      );
    }
    // 휴대폰 옆으로 플로피가 쏟아져 산더미 → 휴대폰 하나 = 플로피 8만 장
    case "tower": {
      const n = Math.floor(interpolate(f, [4, 60], [0, 180], clamp));
      return (
        <group rotation={[-0.25, 0.3, 0]}>
          <group position={[-9, 0, 0]} scale={pop(f)}><Phone /></group>
          {Array.from({ length: n }).map((_, i) => {
            const col = i % 12, row = Math.floor(i / 12);
            const fall = Math.max(0, 1 - (f - 4 - i * 0.3) / 6);
            return (
              <group key={i} position={[-1 + (col % 4) * 3.2, -6 + row * 0.45 + fall * 8, -1 + Math.floor(col / 4) * 3.2]} rotation={[-Math.PI / 2, 0, (i * 0.37) % 0.4 - 0.2]} scale={0.32}>
                <Box size={[9, 9.4, T]} color={["#2F4F8F", "#C0392B", "#2E8B57", "#333"][i % 4]} />
              </group>
            );
          })}
        </group>
      );
    }
    // 3D 디스크가 정면으로 돌아 납작해지며 '저장' 그림이 된다 (그림은 위에 HTML 로)
    case "save": {
      const turn = ease(f, 0, 18);
      const flat = ease(f, 14, 26);
      return (
        <group rotation={[0, (1 - turn) * 0.9, 0]} scale={[0.75, 0.75, 0.75 * (1 - flat * 0.97)]}>
          <Floppy35 />
        </group>
      );
    }
    default:
      return null;
  }
};

// 저장 아이콘 (흔한 '저장' 그림: 네모 + 위쪽 덧문 + 아래 라벨) — 상표 없는 일반 모양
const SaveIcon: React.FC<{ f: number }> = ({ f }) => {
  const k = interpolate(f, [22, 30], [0, 1], clamp);
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: k }}>
      <svg viewBox="0 0 24 24" width={520} height={520} style={{ filter: `drop-shadow(14px 14px 0 ${INK})` }}>
        <path d="M3 3h14l4 4v14H3z" fill="#2F4F8F" stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />
        <rect x="7" y="3" width="9" height="6" fill="#D7DCE3" stroke={INK} strokeWidth={0.6} />
        <rect x="12.5" y="4" width="2" height="4" fill="#2F4F8F" />
        <rect x="6" y="13" width="12" height="8" fill="#FBF7EC" stroke={INK} strokeWidth={0.6} />
      </svg>
    </AbsoluteFill>
  );
};

export const ThreeLayer: React.FC<{ shot: ThreeShot; f: number; width?: number; height?: number }> = ({ shot, f, width = 1920, height = 1080 }) => (
  <AbsoluteFill style={{ transform: `translate(${((shot.x ?? 0.5) - 0.5) * width}px, ${((shot.y ?? 0.5) - 0.5) * height}px) scale(${shot.scale ?? 1})` }}>
    <ThreeCanvas width={width} height={height} flat camera={{ position: [0, 0, 32], fov: 30 }}>
      <Lights />
      <Scene shot={shot} f={f} />
    </ThreeCanvas>
    {shot.scene === "save" ? <SaveIcon f={f} /> : null}
  </AbsoluteFill>
);
