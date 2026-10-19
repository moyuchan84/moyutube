import type { ArmAngle, Dance, Prop } from "./Char3D";

// 콩트용 몸 연기 사전. 대본(episodes.json)의 act 에 이름을 적으면 그 연기를 한다.
// t = 초, s = 상대 쪽을 향하는 방향(후배 +1, 선배 -1), local = 이 연기를 시작한 뒤 지난 초
export type ActFn = (t: number, s: number, local: number) => Partial<Dance>;

const arm = (z: number, elbow = 0, x = 0, wrist = 0): ArmAngle => ({ z, x, elbow, wrist });
// 상대를 가리키는 팔(point)과 나머지 팔(other)을 화면 방향에 맞게 왼/오른쪽에 배치
const pair = (point: ArmAngle, other: ArmAngle, s: number) => (s < 0 ? { left: point, right: other } : { left: other, right: point });
const ease01 = (v: number) => 1 - (1 - Math.min(1, Math.max(0, v))) ** 3;
const limp = { left: arm(0.14, 0.1), right: arm(0.14, 0.1) };
const wheelArms = (t: number) => ({ left: arm(0.25, 0.5, -0.9 + 0.02 * Math.sin(t * 20)), right: arm(0.25, 0.5, -0.9 + 0.02 * Math.sin(t * 20 + 1)) });

export const ACTS: Record<string, ActFn> = {
  idle: (t) => ({ ...limp, shrug: 0.02 * Math.sin(t * 2.4) }),
  // 축 처진 무표정
  deadpan: (t, s) => ({ ...limp, bendX: 0.1, headZ: 0.04 * Math.sin(t * 2), twistY: s * 0.1, shrug: -0.03 }),
  // 호통: 상대를 향해 몸을 돌려 숙이며 삿대질
  scold: (t, s) => ({
    ...pair(arm(1.45 + 0.1 * Math.sin(t * 10), 0.1), arm(0.55, 1.7), s),
    twistY: s * 0.45, bendX: 0.15 + 0.08 * Math.abs(Math.sin(t * 9)), headY: s * 0.3, shrug: 0.05,
  }),
  // 움찔: 한 방 맞고 뒤로 물러남
  flinch: (t, s, local) => ({ left: arm(0.5, 1.2), right: arm(0.5, 1.2), bendX: -0.18, shrug: 0.12, headY: -s * 0.15 * Math.min(1, local * 4), headZ: 0.1 }),
  // 나는 억울해: 두 손을 펼치고 어깨를 으쓱
  shrugOff: (t) => ({ left: arm(0.9, 0.9, -0.5), right: arm(0.9, 0.9, -0.5), shrug: 0.18, headZ: 0.2 * Math.sin(t * 3), bendX: -0.05 }),
  // 앞으로 쭉 (직진!)
  pointFwd: (t, s) => ({ ...pair(arm(0.35, 0.4, -1.3 - 0.1 * Math.abs(Math.sin(t * 8))), arm(0.55, 1.9), s), bendX: 0.1, twistY: s * 0.1 }),
  // 핸들을 꽉 잡고 정면
  wheel: (t, s) => ({ ...wheelArms(t), twistY: s * 0.05, shrug: 0.02, bendX: 0.04 }),
  // 오른팔로 휙 (우회전!)
  sweepRight: (t) => ({ left: arm(0.55, 1.7), right: arm(1.5 + 0.35 * Math.sin(t * 4), 0.2), twistY: 0.3 * Math.sin(t * 2) + 0.2, bendX: 0.1, headZ: 0.15 }),
  // 으스대기: 깍지 끼고 머리 뒤로
  smug: (t, s) => ({ left: arm(1.6, 2.4), right: arm(1.6, 2.4), headZ: 0.15, bendX: -0.12, twistY: s * 0.15, shrug: 0.06 + 0.02 * Math.sin(t * 3) }),
  // 항복: 두 손 들고 도리도리
  surrender: (t) => ({ left: arm(2.0, 0.6, 0, 0.5 * Math.sin(t * 14)), right: arm(2.0, 0.6, 0, 0.5 * Math.sin(t * 14 + 1)), bendX: -0.22, headY: Math.sin(t * 13) * 0.35, headZ: 0.1, shrug: 0.12 }),
  // 얼어붙음
  freeze: () => ({ ...limp, bendX: -0.08, shrug: 0.1 }),
  // 핸들을 쥔 채 천천히 상대 쪽으로 고개를 돌려 쳐다본다
  lookOver: (t, s, local) => ({ ...wheelArms(t), twistY: s * Math.min(0.5, local * 0.35), headY: s * Math.min(0.55, local * 0.4), bendX: 0.05 }),
  // ---- 투자편 ----
  // 휴대폰을 들여다봄 (오른손에 휴대폰)
  phone: (t) => ({ left: arm(0.1, -0.9, -1.35), right: arm(0.1, -1.3, -1.5), headX: 0.22 + 0.02 * Math.sin(t * 2), bendX: 0.05, shrug: 0.03 }),
  // 신나서 주먹을 쥐고 위아래로
  cheer: (t) => ({ left: arm(0.1, -0.9, -1.35), right: arm(1.3 + 0.9 * Math.abs(Math.sin(t * 7)), 1.4), headZ: 0.15 * Math.sin(t * 7), shrug: 0.06, bounce: 0.06 * Math.abs(Math.sin(t * 7)) }),
  // 가슴에 손을 얹고, 다른 손은 이마에 — 과장된 슬픔
  heartache: (t) => ({ left: arm(1.3, 2.1, -0.3), right: arm(0.25, -1.6, -0.7), headZ: 0.22, headX: -0.15 + 0.03 * Math.sin(t * 3), bendX: -0.1 }),
  // 배를 움켜쥐고 웅크림 (배 아파)
  stomach: (t) => ({ left: arm(0.15, -1.3, -0.7), right: arm(0.15, -1.3, -0.7), bendX: 0.32 + 0.05 * Math.sin(t * 6), headX: 0.15, shrug: 0.1, swayX: 0.04 * Math.sin(t * 9) }),
  // 두 손을 모으고 앞뒤로 흔들며 주문 (떨어져라…)
  chant: (t) => ({ left: arm(0.12, -1.5, -1.05), right: arm(0.12, -1.5, -1.05), bendX: 0.12 + 0.1 * Math.sin(t * 5), headX: 0.25, headZ: 0.06 * Math.sin(t * 2.5) }),
  // 만세
  banzai: (t) => ({ left: arm(2.7 + 0.15 * Math.sin(t * 16), 0.2), right: arm(2.7 + 0.15 * Math.sin(t * 16 + 1), 0.2), bounce: 0.14 * Math.abs(Math.sin(t * 8)), headX: -0.2, bendX: -0.12 }),

  // ---- 사무실편 ----
  // 키보드 타닥타닥
  typing: (t) => ({ left: arm(0.12, -0.5, -0.9 + 0.1 * Math.sin(t * 31)), right: arm(0.12, -0.5, -0.9 + 0.1 * Math.sin(t * 29 + 2)), headX: 0.12, bendX: 0.08 }),
  // 서류 던지기: 뒤로 젖혔다가 상대 쪽으로 휙
  toss: (t, s, local) => {
    const k = ease01((local - 0.15) / 0.18);
    return { ...pair(arm(0.6 + 0.9 * k, 1.6 * (1 - k), 0.4 - 1.2 * k), arm(0.14, 0.1), s), twistY: s * (-0.3 + 0.7 * k), bendX: -0.1 + 0.2 * k, headY: s * 0.3 * k };
  },
  // 거수경례 (가슴 쫙)
  salute: (t, s, local) => ({ left: arm(0.14, 0.1), right: arm(1.45, 2.35, -0.3), bendX: -0.12, headX: -0.08, shrug: 0.05, bounce: 0.12 * Math.max(0, 1 - local * 4) }),
  // 주먹 쥐고 부들부들 결의
  resolve: (t) => ({ left: arm(0.14, 0.1), right: arm(0.35, -2.0, -1.25), bendX: 0.1, headX: 0.08, shrug: 0.08, swayX: 0.025 * Math.sin(t * 60) }),
  // 골프채를 어깨에 메고 휘파람 불며 화면 밖으로
  golfLeave: (t, s, local) => ({ left: arm(0.14, 0.1), right: arm(1.25, 2.3, -0.2), headZ: 0.12 * Math.sin(t * 7), bounce: local > 0.7 ? 0.1 * Math.abs(Math.sin(t * 14)) : 0, swayX: local > 0.7 ? Math.min(9, (local - 0.7) ** 2 * 30) : 0 }),
  // 웃는데 주먹이 떨린다
  tremble: (t) => ({ left: arm(0.25, -1.0, -0.6), right: arm(0.25, -1.0, -0.6), shrug: 0.07, swayX: 0.018 * Math.sin(t * 70), headZ: 0.02 * Math.sin(t * 55) }),
  // 의자 뒤에서 스윽 솟아오름
  lurk: (t, s, local) => ({ left: arm(0.14, 0.1), right: arm(0.14, 0.1), headZ: 0.22, bendX: 0.12, bounce: -1.8 * (1 - ease01(local / 0.45)), swayX: 0.03 * Math.sin(t * 2) }),
};

// 오른손에 소품을 드는 연기
export const ACT_PROP: Record<string, Prop> = { phone: "phone", cheer: "phone", banzai: "phone", golfLeave: "club" };
