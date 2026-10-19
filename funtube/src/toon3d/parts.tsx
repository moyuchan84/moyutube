import React from "react";
import * as THREE from "three";

// 3단계로 끊어 떨어지는 음영 → 만화 느낌
const gradient = (() => {
  const tex = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat);
  tex.minFilter = tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
})();

type Shape = "sphere" | "capsule" | "box" | "cone" | "torus";
const geometry = (shape: Shape, a: number[]) => {
  switch (shape) {
    case "sphere": return <sphereGeometry args={[a[0], 32, 20, 0, a[1] ?? Math.PI * 2, 0, a[2] ?? Math.PI]} />;
    case "capsule": return <capsuleGeometry args={[a[0], a[1], 8, 16]} />;
    case "box": return <boxGeometry args={[a[0], a[1], a[2]]} />;
    case "cone": return <coneGeometry args={[a[0], a[1], 12]} />;
    case "torus": return <torusGeometry args={[a[0], a[1], 12, 32]} />;
  }
};

type PartProps = {
  shape: Shape;
  args: number[];
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  outline?: number; // 윤곽선 두께 배율 (0 이면 없음)
  emissive?: string;
  opacity?: number;
};

// 색 면 + 뒤집어 키운 검은 껍질(윤곽선)
export const Part: React.FC<PartProps> = ({ shape, args, color, position, rotation, scale, outline = 1.07, emissive, opacity }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh>
      {geometry(shape, args)}
      <meshToonMaterial color={color} gradientMap={gradient} emissive={emissive ?? "#000000"} transparent={opacity !== undefined} opacity={opacity ?? 1} />
    </mesh>
    {outline > 0 && opacity === undefined && (
      <mesh scale={outline}>
        {geometry(shape, args)}
        <meshBasicMaterial color="#1a1420" side={THREE.BackSide} />
      </mesh>
    )}
  </group>
);
