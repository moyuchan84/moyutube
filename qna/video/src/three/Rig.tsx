// 관절 인형 — 잘라 낸 부위(public/rig/<인물>/<부위>.png)를 관절점에서 돌린다
// 각도는 라디안, 양수 = 화면에서 시계 반대 방향
import { useEffect, useState } from "react";
import * as THREE from "three";
import { continueRender, delayRender, staticFile } from "remotion";
import rigs from "./rigs.json";

type PartDef = { box: number[]; pivot: number[]; parent: string; z: number; face?: boolean };
type RigDef = { width: number; height: number; faces: string[]; parts: Record<string, PartDef> };
export type RigName = keyof typeof rigs;

export type RigPose = {
  hipY?: number; // 몸 전체 들썩 (월드 단위)
  squash?: number; // 1 = 그대로, 착지 때 < 1
  torso?: number;
  head?: number;
  armL?: number;
  armR?: number;
  foreL?: number; // 팔꿈치
  foreR?: number;
  face?: string; // 머리 그림: apose · mouth-a · blink · shock …
  legL?: number;
  legR?: number;
};

export const useRigTextures = (names: RigName[]) => {
  const [handle] = useState(() => delayRender("rig textures"));
  const [tex, setTex] = useState<Record<string, THREE.Texture> | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const jobs = names.flatMap((n) => {
      const def = (rigs as Record<string, RigDef>)[n];
      return Object.entries(def.parts).flatMap(([p, d]) => (d.face ? def.faces.map((f) => `${n}/${p}-${f}`) : [`${n}/${p}`]));
    });
    Promise.all(jobs.map((j) => loader.loadAsync(staticFile(`rig/${j}.png`)))).then((ts) => {
      const out: Record<string, THREE.Texture> = {};
      ts.forEach((t, i) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        out[jobs[i]] = t;
      });
      setTex(out);
      continueRender(handle);
    });
  }, [handle]);
  return tex;
};

const Part: React.FC<{ name: string; part: string; def: RigDef; s: number; tex: Record<string, THREE.Texture>; pose: RigPose; children?: React.ReactNode }> = ({
  name, part, def, s, tex, pose, children,
}) => {
  const d = def.parts[part];
  const [l, t, w, h] = d.box;
  const parentPivot = d.parent === "hip" ? def.parts.torso.pivot : def.parts[d.parent].pivot;
  const pos: [number, number, number] = [(d.pivot[0] - parentPivot[0]) * s, -(d.pivot[1] - parentPivot[1]) * s, 0];
  const angle = (pose as Record<string, number>)[part] ?? 0;
  return (
    <group position={pos} rotation={[0, 0, angle]}>
      <mesh position={[(l + w / 2 - d.pivot[0]) * s, -(t + h / 2 - d.pivot[1]) * s, d.z * 0.02]} renderOrder={d.z}>
        <planeGeometry args={[w * s, h * s]} />
        <meshBasicMaterial map={tex[d.face ? `${name}/${part}-${pose.face && def.faces.includes(pose.face) ? pose.face : "apose"}` : `${name}/${part}`]} transparent alphaTest={0.4} toneMapped={false} />
      </mesh>
      {children}
    </group>
  );
};

// 발 위치(x, y, z)에 선 관절 인형
export const RigCharacter: React.FC<{ name: RigName; tex: Record<string, THREE.Texture>; height: number; x: number; y: number; z: number; yaw?: number; pose: RigPose }> = ({
  name, tex, height, x, y, z, yaw = 0, pose,
}) => {
  const def = (rigs as Record<string, RigDef>)[name];
  const s = height / def.height;
  const hip = def.parts.torso.pivot;
  const childrenOf = (parent: string): React.ReactNode =>
    Object.keys(def.parts)
      .filter((p) => def.parts[p].parent === parent)
      .map((p) => (
        <Part key={p} name={name} part={p} def={def} s={s} tex={tex} pose={pose}>
          {childrenOf(p)}
        </Part>
      ));
  // 엉덩이 관절은 발에서 (그림 높이 - hip y) 위
  const hipHeight = (def.height - hip[1]) * s;
  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      <group scale={[1 / Math.sqrt(pose.squash ?? 1), pose.squash ?? 1, 1]}>
        <group position={[0, hipHeight + (pose.hipY ?? 0), 0]}>{childrenOf("hip")}</group>
      </group>
    </group>
  );
};
