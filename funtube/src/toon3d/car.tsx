import React from "react";
import { staticFile } from "remotion";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { rand } from "../toon/fx";
import { Char3D } from "./Char3D";
import { Part } from "./parts";

// 카메라: 보는 곳(tx, ty), 거리, 돌기(orbit), 기울기(roll), 흔들림(shake)
export const Rig: React.FC<{ orbit?: number; roll?: number; dist: number; tx?: number; ty?: number; camY?: number; shake?: { x: number; y: number } }> = ({
  orbit = 0, roll = 0, dist, tx = 0, ty = 0.7, camY = 1.5, shake = { x: 0, y: 0 },
}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(tx + Math.sin(orbit) * dist + shake.x, camY + shake.y, Math.cos(orbit) * dist);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(tx, ty, 0);
  return null;
};

// 창밖 건물 한 겹. dist 가 늘어날수록 뒤로 흘러간다
export const City: React.FC<{ dist: number; factor: number; z: number; n: number; hue: number; light: number; seed: number }> = ({ dist, factor, z, n, hue, light, seed }) => {
  const span = 44;
  const off = (dist * factor) / 90;
  return (
    <>
      {Array.from({ length: n }, (_, k) => {
        const x0 = (k / n) * span;
        const x = ((((x0 - off) % span) + span) % span) - span / 2;
        const h = 3 + rand(seed + k) * 7;
        const wd = (span / n) * (0.7 + 0.2 * rand(seed * 5 + k));
        return (
          <mesh key={k} position={[x, h / 2 - 0.6, z]}>
            <boxGeometry args={[wd, h, 1.5]} />
            <meshToonMaterial color={new THREE.Color().setHSL(hue, 0.45, light)} />
          </mesh>
        );
      })}
    </>
  );
};

// 캐릭터 뒤쪽: 창밖 도시와 도로, 차 천장 · 기둥 · 머리받침
export const CarBack: React.FC<{ dist: number; hue: number; seatX: number[] }> = ({ dist, hue, seatX }) => (
  <>
    <City dist={dist} factor={0.25} z={-22} n={12} hue={hue} light={0.66} seed={3} />
    <City dist={dist} factor={0.6} z={-15} n={10} hue={hue} light={0.55} seed={7} />
    <City dist={dist} factor={1.2} z={-9} n={8} hue={hue} light={0.42} seed={11} />
    <mesh position={[0, -0.62, -12]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 30]} />
      <meshToonMaterial color="#555a66" />
    </mesh>
    {Array.from({ length: 8 }, (_, k) => {
      const span = 44;
      const x = ((((k * 6 - (dist * 2) / 90) % span) + span) % span) - span / 2;
      return (
        <mesh key={k} position={[x, -0.6, -6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 0.18]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      );
    })}
    <Part shape="box" args={[9, 0.8, 3]} color="#2a2c36" position={[0, 4.55, 0.2]} />
    <Part shape="box" args={[0.16, 6, 0.2]} color="#2a2c36" position={[0, 2, -1.2]} outline={0} />
    {([-1, 1] as const).map((s) => (
      <Part key={s} shape="box" args={[0.5, 6, 0.4]} color="#2a2c36" position={[s * 2.6, 2, -0.3]} rotation={[0, 0, s * -0.06]} outline={0} />
    ))}
    {seatX.map((x) => (
      <Part key={x} shape="box" args={[1.5, 2.2, 0.35]} color="#3c4152" position={[x, 1.5, -0.7]} />
    ))}
  </>
);

// 캐릭터 앞쪽: 대시보드와 핸들 (캐릭터 아랫몸을 가린다)
export const CarFront: React.FC<{ wheelRot?: number }> = ({ wheelRot = 0 }) => (
  <>
    <Part shape="box" args={[16, 9, 2]} color="#3b3f4d" position={[0, -3.95, 1.6]} />
    <group position={[-1.2, 0.95, 1.7]} rotation={[-1.0, 0, wheelRot]}>
      <Part shape="torus" args={[0.6, 0.08]} color="#15161c" />
    </group>
  </>
);

// 표정 그림(public/faces/<이름>_1..6.png)을 불러와 입힌 캐릭터. faceIdx 는 1~6
export const FaceChar: React.FC<React.ComponentProps<typeof Char3D> & { who: string; faceIdx: number }> = ({ who, ...rest }) => {
  const tex = useLoader(THREE.TextureLoader, [1, 2, 3, 4, 5, 6].map((i) => staticFile(`faces/${who}_${i}.png`)));
  React.useMemo(() => tex.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; }), [tex]);
  return <Char3D {...rest} faceTex={tex} faceIdx={rest.faceIdx - 1} />;
};
