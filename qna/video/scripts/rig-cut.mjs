// 관절 인형 부위 자르기: public/rig-src/<인물>-apose.png (rig-key.mjs 결과) 를 머리 · 몸통 · 위팔 · 아래팔 · 다리로 자르고,
// 얼굴만 바꾼 그림(<인물>-<얼굴>.png)에서는 같은 윤곽으로 머리만 잘라 head-<얼굴>.png 로 둔다.
//   node scripts/rig-key.mjs && node scripts/rig-cut.mjs   →   public/rig/<인물>/*.png · src/three/rigs.json
// 좌표는 높이 1500 그림 기준. 같은 위치에서 자르므로 얼굴 그림은 기본 그림과 몸 위치가 같아야 한다 (ART_GUIDE 8절).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RIGS = {
  dad: {
    faces: ["mouth-a", "mouth-o", "mouth-e", "blink", "shock", "laugh", "smug", "panic"],
    parts: {
      legL: { poly: [[355, 980], [560, 980], [550, 1100], [560, 1445], [300, 1445], [330, 1200]], pivot: [450, 1010], parent: "hip", z: 0 },
      legR: { poly: [[540, 980], [775, 980], [765, 1200], [765, 1445], [560, 1445], [545, 1100]], pivot: [660, 1010], parent: "hip", z: 0 },
      torso: { poly: [[330, 495], [800, 495], [790, 620], [778, 770], [782, 1000], [358, 1000], [357, 770], [350, 620]], pivot: [560, 990], parent: "hip", z: 1 },
      armL: { poly: [[320, 545], [405, 555], [360, 775], [300, 805], [205, 745], [250, 640]], pivot: [360, 610], parent: "torso", z: 2 },
      foreL: { poly: [[300, 750], [365, 790], [255, 900], [240, 1000], [105, 1005], [105, 850], [200, 725]], pivot: [268, 752], parent: "armL", z: 3 },
      armR: { poly: [[700, 535], [785, 545], [875, 640], [935, 725], [840, 785], [778, 772], [745, 700]], pivot: [760, 600], parent: "torso", z: 2 },
      foreR: { poly: [[850, 690], [945, 720], [995, 830], [1045, 880], [1045, 1015], [925, 1015], [900, 885], [815, 800]], pivot: [878, 722], parent: "armR", z: 3 },
      head: { poly: [[340, 40], [805, 40], [805, 420], [745, 470], [685, 540], [560, 578], [470, 562], [400, 505], [345, 440]], pivot: [560, 545], parent: "torso", z: 4, face: true },
    },
  },
  kid: {
    faces: ["mouth-a", "mouth-o", "mouth-e", "blink", "shock", "laugh", "doubt"],
    parts: {
      legL: { poly: [[370, 1120], [527, 1120], [522, 1462], [375, 1462], [380, 1300]], pivot: [460, 1140], parent: "hip", z: 0 },
      legR: { poly: [[518, 1120], [685, 1120], [695, 1390], [518, 1390]], pivot: [600, 1140], parent: "hip", z: 0 },
      torso: { poly: [[300, 520], [622, 520], [652, 700], [657, 770], [662, 1000], [652, 1155], [368, 1155], [375, 770], [330, 650]], pivot: [515, 1130], parent: "hip", z: 1 },
      armL: { poly: [[300, 605], [372, 640], [382, 772], [300, 862], [215, 800], [250, 700]], pivot: [340, 680], parent: "torso", z: 2 },
      foreL: { poly: [[228, 765], [325, 828], [252, 942], [242, 1045], [105, 1045], [105, 900], [188, 778]], pivot: [255, 820], parent: "armL", z: 3 },
      armR: { poly: [[578, 578], [642, 598], [722, 658], [765, 722], [692, 795], [650, 772], [638, 700]], pivot: [630, 640], parent: "torso", z: 2 },
      foreR: { poly: [[678, 700], [772, 708], [832, 818], [895, 898], [885, 965], [778, 965], [738, 852], [655, 780]], pivot: [710, 745], parent: "armR", z: 3 },
      head: { poly: [[200, 55], [722, 55], [722, 420], [652, 522], [562, 582], [450, 582], [360, 542], [268, 522], [218, 462], [200, 380]], pivot: [470, 560], parent: "torso", z: 4, face: true },
    },
  },
};

const pts = (poly) => poly.map(([x, y]) => `${x},${y}`).join(" ");
const cut = async (src, poly, file) => {
  const { width: W, height: H } = await sharp(src).metadata();
  const xs = poly.map((q) => q[0]), ys = poly.map((q) => q[1]);
  const left = Math.max(0, Math.min(...xs)), top = Math.max(0, Math.min(...ys));
  const box = { left, top, width: Math.min(W, Math.max(...xs)) - left, height: Math.min(H, Math.max(...ys)) - top };
  const mask = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><polygon points="${pts(poly)}" fill="#fff"/></svg>`);
  const masked = await sharp(src).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  await sharp(masked).extract(box).png().toFile(file);
  return { box: [box.left, box.top, box.width, box.height], W, H };
};

const out = {};
for (const [name, rig] of Object.entries(RIGS)) {
  const dir = path.join("public/rig", name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const base = `public/rig-src/${name}-apose.png`;
  const def = { width: 0, height: 0, faces: ["apose", ...rig.faces], parts: {} };
  for (const [part, p] of Object.entries(rig.parts)) {
    const file = p.face ? `${part}-apose.png` : `${part}.png`;
    const r = await cut(base, p.poly, path.join(dir, file));
    def.width = r.W;
    def.height = r.H;
    def.parts[part] = { box: r.box, pivot: p.pivot, parent: p.parent, z: p.z, ...(p.face ? { face: true } : {}) };
    if (p.face) for (const face of rig.faces) await cut(`public/rig-src/${name}-${face}.png`, p.poly, path.join(dir, `${part}-${face}.png`));
  }
  out[name] = def;
  console.log(name, Object.keys(rig.parts).join(" "), "· faces", rig.faces.length + 1);
}
fs.writeFileSync("src/three/rigs.json", JSON.stringify(out, null, 2) + "\n");
