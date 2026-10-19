import React from "react";
import * as THREE from "three";
import { Part } from "./parts";

export type Mood = "normal" | "angry" | "sad" | "smirk" | "shock" | "dizzy" | "glow";
export type Prop = "phone" | "club";
export type Look = { hair: string; shirt: string; pants?: string; skin?: string; glasses?: boolean; tie?: boolean };

// 관절 각도 (라디안). z = 옆으로 들어올림, x = 앞으로, elbow = 팔꿈치 굽힘
export type ArmAngle = { z: number; x: number; elbow: number; wrist?: number };
export type Dance = {
  left: ArmAngle; right: ArmAngle; headZ: number; headX: number; leanZ: number; bounce: number; squash: number;
  headSquash?: number; // 0~1: 머리가 눌렸다 튀는 정도 (박자마다)
  twistY?: number; // 허리 비틀기 (+ 면 화면 오른쪽으로 돈다)
  bendX?: number; // 허리 숙이기 (+ 면 카메라 쪽으로 숙임, - 면 젖힘)
  headY?: number; // 고개 돌리기 (도리도리)
  shrug?: number; // 어깨 으쓱 (위로 올림)
  swayX?: number; // 몸 전체 좌우 흔들림
};

const Arm: React.FC<{ side: -1 | 1; a: ArmAngle; shirt: string; skin: string; thin: boolean; shrug: number; prop?: Prop }> = ({ side, a, shirt, skin, thin, shrug, prop }) => {
  const r1 = thin ? 0.075 : 0.12, r2 = thin ? 0.07 : 0.11, hand = thin ? 0.13 : 0.15;
  return (
    <group position={[side * 0.5, 1.28 + shrug, 0]} rotation={[a.x, 0, side * a.z]}>
      <Part shape="capsule" args={[r1, thin ? 0.38 : 0.3]} color={shirt} position={[0, -0.24, 0]} />
      <group position={[0, -0.47, 0]} rotation={[0, 0, side * a.elbow]}>
        <Part shape="capsule" args={[r2, thin ? 0.36 : 0.28]} color={shirt} position={[0, -0.22, 0]} />
        <group position={[0, -0.42, 0]} rotation={[0, 0, side * (a.wrist ?? 0)]}>
          <Part shape="capsule" args={[r2 * 0.8, thin ? 0.1 : 0.08]} color={shirt} position={[0, -0.05, 0]} />
          <Part shape="sphere" args={[hand]} color={skin} position={[0, -0.16, 0]} />
          {prop === "phone" && (
            <group position={[0, -0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <Part shape="box" args={[0.22, 0.4, 0.04]} color="#1b1d26" />
              <mesh position={[0, 0, 0.025]}>
                <planeGeometry args={[0.18, 0.34]} />
                <meshBasicMaterial color="#7fd6ff" />
              </mesh>
            </group>
          )}
          {prop === "club" && (
            <group position={[0, -0.18, 0]}>
              <Part shape="capsule" args={[0.035, 1.5]} color="#c9ccd6" position={[0, 0.7, 0]} outline={1.2} />
              <Part shape="box" args={[0.32, 0.14, 0.12]} color="#5a5f6e" position={[-0.1, 1.5, 0]} />
            </group>
          )}
        </group>
      </group>
    </group>
  );
};

const BROW: Record<Mood, [number, number]> = {
  normal: [0, 0], angry: [-0.45, 0.04], sad: [0.4, 0.0], smirk: [-0.1, 0.0], shock: [0, 0.1], dizzy: [0.3, 0.02], glow: [-0.5, 0.04],
};

export const Char3D: React.FC<{
  look: Look; mood: Mood; dance: Dance; talk: number; x: number; z?: number; scale?: number; frame: number;
  faceTex?: THREE.Texture[]; // 있으면 그림 얼굴 데칼 모드 (표정 텍스처 6장)
  faceIdx?: number; // 0~5
  prop?: Prop; // 오른손에 든 소품
}> = ({ look, mood, dance, talk, x, z = 0, scale = 1, frame, faceTex, faceIdx = 0, prop }) => {
  const skin = look.skin ?? "#ffd9b8";
  const glow = mood === "glow";
  const hair = glow ? "#ffd23a" : look.hair;
  const [brow, browUp] = BROW[mood];
  const eyeY = mood === "shock" ? 1.5 : mood === "dizzy" ? 0.25 : 1;
  const blink = frame % 96 > 91 ? 0.12 : 1;
  const mouthW = mood === "shock" ? 0.1 : 0.15;
  const mouthH = talk > 0 ? 0.04 + 0.13 * talk : mood === "shock" ? 0.12 : mood === "smirk" ? 0.03 : 0.025;
  const face = !!faceTex;
  // 그림 얼굴 모드: 머리를 키우고(귀여움), 몸은 줄이고, 팔은 국수처럼 가늘게
  const hs = dance.headSquash ?? 0;
  const headScale: [number, number, number] = face ? [1.25 * (1 - 0.06 * hs), 1.25 * (1 + 0.12 * hs), 1.25] : [1, 1, 1];
  const hairR = face ? 0.58 : 0.6;

  return (
    <group position={[x + (dance.swayX ?? 0), dance.bounce, z]} scale={[scale, scale * dance.squash, scale]} rotation={[0, 0, dance.leanZ]}>
      {glow && (
        <mesh position={[0, 1.2, -0.3]}>
          <sphereGeometry args={[1.5, 24, 16]} />
          <meshBasicMaterial color="#ffcf3a" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
      {look.pants && <Part shape="capsule" args={[0.3, 0.5]} color={look.pants} position={[0, 0.3, 0]} scale={[1.1, 1, 0.8]} />}
      {/* 윗몸: 허리를 축으로 비틀고 숙인다 */}
      <group position={[0, 0.6, 0]} rotation={[dance.bendX ?? 0, dance.twistY ?? 0, 0]}>
      <group position={[0, -0.6, 0]}>
      {/* 몸통 + 목 아래 */}
      <Part shape="capsule" args={[0.36, 0.55]} color={look.shirt} position={[0, 0.95, 0]} scale={face ? [0.9, 0.95, 0.75] : [1, 1, 0.8]} />
      <Part shape="box" args={[0.3, 0.1, 0.3]} color="#eeeeee" position={[0, 1.42, 0.1]} />
      {look.tie && <Part shape="box" args={[0.13, 0.5, 0.05]} color="#9b2a2a" position={[0, 1.0, 0.3]} />}
      <Arm side={-1} a={dance.left} shirt={look.shirt} skin={skin} thin={face} shrug={dance.shrug ?? 0} />
      <Arm side={1} a={dance.right} shirt={look.shirt} skin={skin} thin={face} shrug={dance.shrug ?? 0} prop={prop} />

      {/* 머리 */}
      <group position={[0, 1.62, 0]} rotation={[dance.headX, dance.headY ?? 0, dance.headZ]} scale={headScale}>
        <Part shape="sphere" args={[0.56]} color={skin} position={[0, 0.3, 0]} />
        <Part shape="sphere" args={[0.12]} color={skin} position={[-0.56, 0.3, 0]} />
        <Part shape="sphere" args={[0.12]} color={skin} position={[0.56, 0.3, 0]} />
        {/* 머리카락 */}
        {glow ? (
          <>
            <Part shape="sphere" args={[hairR, Math.PI * 2, Math.PI * 0.5]} color={hair} position={[0, 0.32, -0.02]} rotation={[-0.25, 0, 0]} />
            {[-0.4, -0.2, 0, 0.2, 0.4].map((px, i) => (
              <Part key={i} shape="cone" args={[0.14, 0.55 - Math.abs(px) * 0.4]} color={hair} position={[px, 0.98 - Math.abs(px) * 0.2, 0]} rotation={[0, 0, -px * 1.2]} />
            ))}
          </>
        ) : (
          <Part shape="sphere" args={[hairR, Math.PI * 2, Math.PI * 0.52]} color={hair} position={[0, 0.32, -0.03]} rotation={[-0.35, 0, 0]} />
        )}

        {face ? (
          // 그림 얼굴: 머리 앞쪽 일부를 덮는 구 껍질에 표정 텍스처를 입힌다 (전면이 +z, u=왼→오, v=아래→위)
          <mesh position={[0, 0.3, 0]} renderOrder={2} scale={[1, 1 + 0.05 * talk, 1]}>
            <sphereGeometry args={[0.595, 40, 28, Math.PI / 2 - 1.05, 2.1, Math.PI / 2 - 0.1 - 1.05, 2.1]} />
            <meshBasicMaterial map={faceTex![Math.min(faceTex!.length - 1, Math.max(0, faceIdx))]} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-2} toneMapped={false} />
          </mesh>
        ) : (
          <>
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.2, 0.37, 0.5]}>
                <Part shape="sphere" args={[0.11]} color="#ffffff" scale={[1, eyeY * blink, 0.5]} outline={1.12} />
                <Part shape="sphere" args={[0.055]} color={glow ? "#1b8f6a" : "#1a1420"} position={[0, 0, 0.05]} scale={[1, eyeY * blink, 0.6]} outline={0} />
                <Part shape="box" args={[0.24, 0.05, 0.04]} color="#3a2a20" position={[0, 0.17 + browUp, 0.02]} rotation={[0, 0, s * -brow]} outline={0} />
              </group>
            ))}
            {look.glasses && [-1, 1].map((s) => <Part key={s} shape="torus" args={[0.15, 0.02]} color="#222" position={[s * 0.2, 0.37, 0.54]} outline={0} />)}
            <Part shape="sphere" args={[1]} color="#7a2230" position={[0, 0.1, 0.52]} scale={[mouthW, mouthH, 0.05]} outline={0} rotation={[0, 0, mood === "smirk" ? 0.2 : 0]} />
          </>
        )}
      </group>
      </group>
      </group>
    </group>
  );
};
