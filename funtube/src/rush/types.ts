// "N분 요약" 숏폼 엔진의 데이터 형식. 테마 하나 = content/rush/<id>.json 하나.
export type Face = "normal" | "hype" | "shock" | "deadpan" | "cry" | "sweat" | "sleepy" | "smug" | "angry" | "love" | "dead";
export type Pose = "idle" | "wave" | "salute" | "shrug" | "point" | "hold" | "cheer" | "facepalm";
export type Look = {
  hair?: "long" | "bob" | "buzz" | "none";
  hat?: "none" | "cap" | "helmet" | "beanie";
  shirt?: string; // 옷 색
  camo?: boolean; // 전투복 무늬
  rank?: number; // 가슴 계급 패치 줄 수 (0이면 없음)
  skin?: string;
};
export type Side = { label: string; emoji?: string; face?: Face; pose?: Pose; bg?: string };

export type Shot = {
  k: "pic" | "title" | "char" | "close" | "crowd" | "text" | "counter" | "split" | "stamp" | "list" | "meter";
  b: number; // 길이 (박자 수). BPM 에 맞춰 컷이 박자에 떨어진다
  bg?: string;
  bg2?: string;
  pattern?: "rays" | "dots" | "stripes" | "grid" | "paper" | "none";
  dark?: boolean;
  text?: string; // `*강조*` 노랑, `/` 줄바꿈
  sub?: string;
  art?: string; // pic: public/rush/<테마>/<art>.png (scripts/rush-art.mjs 로 만든다)
  say?: string; // 캐릭터가 말하는 대사 (입 움직임). 없으면 무음
  face?: Face;
  pose?: Pose;
  look?: Look; // 다음 컷에도 이어진다 (바뀐 항목만 적는다)
  cutAnim?: boolean; // 이 컷에서 긴 머리가 잘린다
  emoji?: string[];
  cam?: "push" | "pull" | "shake" | "spin" | "tilt" | "none";
  tr?: "cut" | "flash" | "invert" | "whip" | "zoom" | "glitch" | "flip" | "slash" | "shutter"; // 이 컷으로 들어오는 전환
  sfx?: string | string[];
  clk?: number; // 화면 위 시계가 이 컷에서 가리킬 값
  items?: string[]; // list
  v0?: number; // counter · meter 시작값
  v1?: number; // 끝값
  prefix?: string; // counter 숫자 앞 글자
  label?: string; // counter · meter 위 글자
  n?: number; // crowd 인원
  odd?: number; // crowd 에서 혼자 다른 사람
  left?: Side; // split
  right?: Side;
  // anime 엔진 전용
  line?: string; // 화면 대사 자막 (음성 없음). 있으면 text 는 위쪽 꼬리표로 간다
  crop?: [number, number]; // pic: 그림에서 쓸 세로 범위 (위 %, 아래 %). 위아래 여백 잘라내기
  fx?: ("impact" | "lines" | "rgb" | "sparkle" | "speed")[]; // pic 위 연출
  m?: "hit" | "tense" | "epic" | "stop" | "build" | "calm" | "comic" | "end"; // 배경음악 큐
  kicker?: string; // title: 큰 글자 위 작은 글자 (제1장 등)
};

export type Theme = {
  id: string;
  engine?: "anime"; // anime: 대사 없이 연출 · 자막 · 배경음악으로 가는 일본 애니메이션풍 (src/rush/anime)
  title: string;
  bpm: number;
  voice: string;
  style: string;
  clock?: { label: string; from: number; to: number; unit?: string };
  look?: Look; // 기본 모습
  art?: { style: string; cast: string; layout: string }; // 장면 그림 프롬프트 공통부
  scenes?: Record<string, string>; // 장면 그림별 설명
  shots: Shot[];
};
