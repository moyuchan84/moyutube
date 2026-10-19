// 콘티용 간단 구도 스케치 (SVG). 인물은 막대 인형, 카메라 시작 · 끝 프레임을 겹쳐 그린다.
// 그림 API 를 쓰지 않는다 — 무료. 실제 그림은 나중에 Gemini 로 뽑는다.
const SK = '#f7d9bd';
const INK = '#4a3d2e';
const RED = '#d9483b';

export function fig({ x, y, s = 1, dir = 1, cloth = '#79a8dc', cape = null, arms = [-13, 12, 13, 12], face = 'smile', back = false, hair = '#5b4030', mode = 'stand', crutch = false, rot = 0, girl = false, blush = false }) {
  const crouch = mode === 'crouch';
  const sit = mode === 'sit';
  const neckY = sit ? -30 : crouch ? -31 : -39;
  const hipY = sit ? -6 : crouch ? -14 : -17;
  const headY = sit ? -41 : crouch ? -41 : -50;
  const shY = neckY + 2;
  const capeD = {
    down: `M-6 ${neckY} L6 ${neckY} L10 -6 L-10 -6Z`,
    fly: `M-3 ${neckY} L3 ${neckY + 1} Q-16 ${neckY + 2} -36 ${neckY + 15} Q-18 ${neckY + 17} -4 ${neckY + 17}Z`,
    limp: `M-5 ${neckY} L5 ${neckY} L7 ${hipY + 4} Q0 ${hipY + 10} -7 ${hipY + 4}Z`,
  }[cape];
  const capeSvg = cape ? `<path d="${capeD}" fill="${RED}" stroke="#a8322a" stroke-width=".8"/>` : '';
  let g = '';
  if (cape && !back) g += capeSvg;
  // 다리
  if (crouch) g += `<polyline points="0,${hipY} 10,${hipY + 6} 4,0" fill="none" stroke="#6b7a9a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  else if (sit) g += `<polyline points="0,${hipY} 12,-15 25,-3" fill="none" stroke="#6b7a9a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  else g += `<line x1="0" y1="${hipY}" x2="-5" y2="0" stroke="#6b7a9a" stroke-width="4" stroke-linecap="round"/><line x1="0" y1="${hipY}" x2="5" y2="0" stroke="#6b7a9a" stroke-width="4" stroke-linecap="round"/>`;
  if (crutch) g += `<line x1="-9" y1="${shY}" x2="-15" y2="0" stroke="#8a6a4a" stroke-width="2.2" stroke-linecap="round"/><line x1="9" y1="${shY}" x2="15" y2="0" stroke="#8a6a4a" stroke-width="2.2" stroke-linecap="round"/>`;
  // 몸 · 팔
  g += `<line x1="0" y1="${neckY}" x2="0" y2="${hipY}" stroke="${cloth}" stroke-width="11" stroke-linecap="round"/>`;
  g += `<line x1="0" y1="${shY}" x2="${arms[0]}" y2="${shY + arms[1]}" stroke="${SK}" stroke-width="3.6" stroke-linecap="round"/><line x1="0" y1="${shY}" x2="${arms[2]}" y2="${shY + arms[3]}" stroke="${SK}" stroke-width="3.6" stroke-linecap="round"/>`;
  if (cape && back) g += capeSvg;
  // 머리
  if (girl) g += `<circle cx="-10" cy="${headY + 3}" r="4" fill="${hair}"/><circle cx="10" cy="${headY + 3}" r="4" fill="${hair}"/>`;
  if (back) {
    g += `<circle cx="0" cy="${headY}" r="9.6" fill="${hair}"/>`;
  } else {
    g += `<circle cx="0" cy="${headY}" r="9.5" fill="${SK}" stroke="${INK}" stroke-width=".8"/>`;
    g += `<path d="M-9.5 ${headY - 1} A9.5 9.5 0 0 1 9.5 ${headY - 1} Q0 ${headY - 8} -9.5 ${headY - 1}Z" fill="${hair}"/>`;
    g += faceSvg(face, headY, blush);
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s * dir} ${s})">${g}</g>`;
}

function faceSvg(f, hy, blush) {
  const eye = (dx, r = 1.5) => `<circle cx="${dx}" cy="${hy}" r="${r}" fill="${INK}"/>`;
  const eyes = eye(-3.6) + eye(3.6);
  const st = `fill="none" stroke="${INK}" stroke-width="1" stroke-linecap="round"`;
  const open = `<ellipse cx="0" cy="${hy + 6}" rx="2.6" ry="3.2" fill="#b5483c"/>`;
  const browIn = `<line x1="-6.5" y1="${hy - 4.5}" x2="-1.5" y2="${hy - 2.5}" ${st}/><line x1="6.5" y1="${hy - 4.5}" x2="1.5" y2="${hy - 2.5}" ${st}/>`;
  const browOut = `<line x1="-6.5" y1="${hy - 2.5}" x2="-1.5" y2="${hy - 4.5}" ${st}/><line x1="6.5" y1="${hy - 2.5}" x2="1.5" y2="${hy - 4.5}" ${st}/>`;
  let o = '';
  switch (f) {
    case 'smile': o = eyes + `<path d="M-3.6 ${hy + 4.5} Q0 ${hy + 8.5} 3.6 ${hy + 4.5}" ${st}/>`; break;
    case 'sad': o = eyes + browOut + `<path d="M-3 ${hy + 7.5} Q0 ${hy + 4} 3 ${hy + 7.5}" ${st}/>`; break;
    case 'open': o = eyes + open; break;
    case 'flat': o = eyes + `<line x1="-3" y1="${hy + 6}" x2="3" y2="${hy + 6}" ${st}/>`; break;
    case 'cry': o = eyes + browOut + open + `<line x1="-5" y1="${hy + 2}" x2="-6" y2="${hy + 10}" stroke="#5aa6e0" stroke-width="1.4" stroke-linecap="round"/><line x1="5" y1="${hy + 2}" x2="6" y2="${hy + 10}" stroke="#5aa6e0" stroke-width="1.4" stroke-linecap="round"/>`; break;
    case 'wow': o = `<circle cx="-3.6" cy="${hy}" r="2.4" fill="#fff" stroke="${INK}" stroke-width=".8"/><circle cx="3.6" cy="${hy}" r="2.4" fill="#fff" stroke="${INK}" stroke-width=".8"/>${eye(-3.6, 1)}${eye(3.6, 1)}<ellipse cx="0" cy="${hy + 6.5}" rx="1.8" ry="2.4" fill="#b5483c"/>`; break;
    case 'determined': o = eyes + browIn + `<line x1="-3" y1="${hy + 6}" x2="3" y2="${hy + 6}" ${st}/>`; break;
    case 'angry': o = eyes + browIn + `<path d="M-3 ${hy + 7.5} Q0 ${hy + 4.5} 3 ${hy + 7.5}" ${st}/>`; break;
    case 'worry': o = eyes + browOut + `<path d="M-3.5 ${hy + 6.5} Q-1.5 ${hy + 4.5} 0 ${hy + 6.5} Q1.5 ${hy + 8.5} 3.5 ${hy + 6.5}" ${st}/>`; break;
    case 'sleep': o = `<path d="M-6 ${hy} Q-3.6 ${hy + 2.5} -1.2 ${hy}" ${st}/><path d="M1.2 ${hy} Q3.6 ${hy + 2.5} 6 ${hy}" ${st}/><path d="M-3 ${hy + 5} Q0 ${hy + 8} 3 ${hy + 5}" ${st}/>`; break;
    default: o = eyes;
  }
  if (blush) o += `<circle cx="-6" cy="${hy + 4}" r="2.2" fill="#f4a3a3" opacity=".7"/><circle cx="6" cy="${hy + 4}" r="2.2" fill="#f4a3a3" opacity=".7"/>`;
  return o;
}

const bg = (top, bottom, gy = 135) => `<rect width="320" height="${gy}" fill="${top}"/><rect y="${gy}" width="320" height="${180 - gy}" fill="${bottom}"/>`;
const tx = (x, y, t, size = 10, fill = INK, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="700" text-anchor="middle" ${extra}>${t}</text>`;
const bubble = (x, y, w, t, tailX = x + w / 2, fill = '#fff') =>
  `<g><rect x="${x}" y="${y}" width="${w}" height="19" rx="8" fill="${fill}" stroke="${INK}" stroke-width=".9"/><polygon points="${tailX - 4},${y + 18} ${tailX + 4},${y + 18} ${tailX},${y + 27}" fill="${fill}" stroke="${INK}" stroke-width=".9"/><rect x="${tailX - 3.5}" y="${y + 17}" width="7" height="2.4" fill="${fill}"/>${tx(x + w / 2, y + 13, t, 9)}</g>`;
const speed = (x, y, n = 3, len = 30) => Array.from({ length: n }, (_, i) => `<line x1="${x}" y1="${y + i * 9}" x2="${x - len + i * 6}" y2="${y + i * 9}" stroke="${INK}" stroke-width="1.2" opacity=".35" stroke-linecap="round"/>`).join('');
const sparkle = (x, y, r = 5, c = '#f2b705') => `<path d="M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28}Z" fill="${c}"/>`;
const house = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width=".7" opacity=".9"/><polygon points="${x - 4},${y} ${x + w / 2},${y - 18} ${x + w + 4},${y}" fill="#c8725f" stroke="${INK}" stroke-width=".7"/><rect x="${x + w / 2 - 6}" y="${y + h - 22}" width="12" height="22" fill="#9c7b5a"/>`;

const PINK = '#f0a3b8';

const scenes = {
  0: () =>
    bg('#f1e3cd', '#d6b896', 128) +
    `<polygon points="190,104 285,104 312,180 150,180" fill="#fff6b0" opacity=".35"/>` +
    `<rect x="226" y="108" width="28" height="9" fill="#3b3b4b"/><rect x="188" y="38" width="104" height="72" rx="6" fill="#3b3b4b"/><rect x="195" y="45" width="90" height="58" fill="#bfe3ff"/><rect x="195" y="88" width="90" height="15" fill="#a8d08a"/>` +
    fig({ x: 240, y: 98, s: 0.5, cape: 'fly', cloth: '#e0883a', arms: [-13, -14, 13, -10] }) +
    `<circle cx="212" cy="93" r="4" fill="#c28" opacity=".7"/><circle cx="222" cy="95" r="4" fill="#28c" opacity=".7"/><circle cx="268" cy="93" r="4" fill="#2a8" opacity=".7"/>` +
    tx(262, 62, '와아!', 9, '#d9483b') + sparkle(210, 62, 4) +
    fig({ x: 92, y: 172, s: 1.4, back: true, cape: 'down', arms: [-12, 20, 12, 20] }) +
    tx(92, 40, '(동경의 눈빛)', 8, '#8a7b68'),

  1: () =>
    bg('#f6ead4', '#caa27a', 140) +
    [[26, 22, 34, 48, '#e8b04b'], [68, 28, 30, 40, '#7fb2e5'], [102, 20, 36, 52, '#e57f7f']].map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width=".7"/>${tx(x + w / 2, y + h / 2 + 5, '★', 14, '#fff')}`).join('') +
    `<rect x="52" y="104" width="220" height="40" rx="6" fill="#b98a62"/><rect x="58" y="92" width="210" height="26" rx="6" fill="#f3e3c4"/><ellipse cx="106" cy="91" rx="26" ry="9" fill="#fff" stroke="${INK}" stroke-width=".6"/>` +
    fig({ x: 176, y: 100, s: 1.1, rot: -90, cape: 'down', arms: [-12, 10, 12, 10] }) +
    `<rect x="150" y="88" width="118" height="30" rx="8" fill="#7fa6d6" opacity=".92"/>` +
    `<ellipse cx="238" cy="38" rx="52" ry="18" fill="#fff" stroke="${INK}" stroke-width=".8"/><circle cx="190" cy="64" r="3" fill="#fff" stroke="${INK}" stroke-width=".7"/><circle cx="182" cy="74" r="2" fill="#fff" stroke="${INK}" stroke-width=".7"/>` +
    tx(238, 41, '세상을 구할 거야!', 9),

  2: () =>
    bg('#d8ecf7', '#d8cdb8', 135) +
    `<circle cx="285" cy="28" r="14" fill="#ffd966"/>` +
    house(18, 72, 50, 63, '#f0c9a0') + house(84, 66, 62, 69, '#c9e0a8') + house(215, 68, 52, 67, '#e8c0c8') + house(282, 78, 44, 57, '#bcd6ec') +
    `<rect y="150" width="320" height="30" fill="#c9bd9e"/><g stroke="#fff" stroke-width="2" stroke-dasharray="14 10"><line x1="0" y1="165" x2="320" y2="165"/></g>` +
    fig({ x: 250, y: 150, s: 0.72, cloth: '#9b9b9b', face: 'smile', hair: '#333' }) + fig({ x: 275, y: 152, s: 0.72, cloth: '#b58fb0', face: 'smile', hair: '#333', girl: true }) +
    tx(262, 100, 'ㅎㅎ', 9, '#8a7b68') +
    speed(112, 120, 4, 34) +
    fig({ x: 150, y: 162, s: 1.3, cape: 'fly', arms: [-18, -8, 18, -8], face: 'open' }) +
    tx(150, 36, '슈우우웅!', 14, '#d9483b'),

  3: () =>
    bg('#f9eed6', '#e3cba4', 120) +
    `<rect x="262" y="82" width="58" height="62" fill="#b9c7d6" stroke="${INK}" stroke-width=".7"/><rect x="268" y="74" width="20" height="8" fill="#e9b04b"/><rect x="294" y="74" width="20" height="8" fill="#e9b04b"/>` +
    [[45, '#a5c58a', 'worry'], [82, '#e9b58f', 'wow'], [119, '#c3a5d9', 'worry']].map(([x, c, f]) => fig({ x, y: 166, s: 0.95, cloth: c, face: f })).join('') +
    fig({ x: 172, y: 168, s: 1.15, cloth: '#e07b5a', arms: [6, 8, -6, 8], face: 'angry' }) +
    bubble(110, 38, 120, '우리 다 기다렸잖아!', 172, '#fffdf0') +
    speed(210, 130, 3, 30) +
    fig({ x: 240, y: 166, s: 1.2, cape: 'fly', arms: [-16, -4, 16, -10], face: 'smile' }) +
    tx(240, 80, '슝!', 13, '#d9483b'),

  4: () =>
    bg('#f4e7d0', '#d9bf95', 118) +
    `<polygon points="95,128 235,128 258,160 72,160" fill="#e8d08a" stroke="${INK}" stroke-width=".8"/>` +
    [[110, 140, '#d9483b'], [150, 150, '#4a89dc'], [200, 138, '#e9b04b'], [225, 150, '#4a9e5c'], [80, 168, '#d9483b'], [180, 170, '#4a89dc'], [250, 172, '#e9b04b']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}" stroke="${INK}" stroke-width=".6"/>`).join('') +
    fig({ x: 48, y: 168, s: 1.3, cape: 'down', arms: [-16, -14, 16, -14], face: 'cry' }) +
    tx(48, 36, '으아앙!!', 13, '#d9483b') + tx(150, 36, '게임은 무효야!', 11, '#d9483b') +
    fig({ x: 150, y: 120, s: 0.85, cloth: '#a5c58a', face: 'wow' }) + fig({ x: 190, y: 118, s: 0.85, cloth: '#e9b58f', face: 'wow' }) +
    fig({ x: 282, y: 172, s: 1.25, cloth: '#7ec2b0', crutch: true, arms: [-6, 24, 10, 6], face: 'flat' }) +
    `<circle cx="266" cy="170" r="3.6" fill="#d9483b" stroke="${INK}" stroke-width=".6"/>`,

  5: () =>
    bg('#dfe6ee', '#c9c3a8', 138) +
    `<ellipse cx="80" cy="30" rx="40" ry="12" fill="#c5ccd6"/><ellipse cx="250" cy="42" rx="46" ry="12" fill="#c5ccd6"/>` +
    `<g stroke="#7a6a58" stroke-width="3" stroke-linecap="round"><line x1="110" y1="36" x2="210" y2="36"/><line x1="110" y1="36" x2="92" y2="146"/><line x1="110" y1="36" x2="128" y2="146"/><line x1="210" y1="36" x2="192" y2="146"/><line x1="210" y1="36" x2="228" y2="146"/></g>` +
    `<g stroke="#8a7b68" stroke-width="1.2"><line x1="150" y1="36" x2="150" y2="106"/><line x1="172" y1="36" x2="172" y2="106"/></g><rect x="144" y="106" width="34" height="5" rx="2" fill="#8a6a4a"/>` +
    fig({ x: 161, y: 124, s: 0.95, back: true, cape: 'limp', arms: [-9, 10, 9, 10] }) +
    [22, 44, 66].map((x, i) => fig({ x, y: 134, s: 0.42, cloth: ['#a5c58a', '#e9b58f', '#c3a5d9'][i], face: 'smile' })).join('') +
    tx(44, 84, 'ㅎㅎ 까르르', 8, '#8a7b68') +
    tx(255, 100, '텅 빈 놀이터', 9, '#8a7b68'),

  6: () =>
    bg('#e6f0f5', '#c8d3a8', 135) +
    fig({ x: 100, y: 164, s: 1.5, cape: 'down', arms: [22, 2, 27, -3], face: 'determined' }) +
    bubble(30, 22, 150, '상처를 낫게 하는 레이저!!', 104, '#fffdf0') +
    `<path d="M152 104 L166 96 L171 108 L186 99 L190 110" fill="none" stroke="#e9c24a" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>` +
    tx(172, 78, '?', 14, '#8a7b68') + tx(196, 88, '?', 11, '#8a7b68') +
    fig({ x: 232, y: 168, s: 1.3, mode: 'sit', cloth: '#7ec2b0', face: 'cry', arms: [-10, 10, 10, 8] }) +
    `<line x1="268" y1="164" x2="308" y2="150" stroke="#8a6a4a" stroke-width="2.4" stroke-linecap="round"/><circle cx="252" cy="148" r="3.2" fill="#e0584c"/>`,

  7: () =>
    bg('#f3ecd2', '#cfd9a8', 130) +
    fig({ x: 52, y: 142, s: 0.9, cape: 'down', arms: [-10, 14, 10, 14], face: 'flat' }) + bubble(30, 36, 44, '…', 52) +
    fig({ x: 150, y: 168, s: 1.45, mode: 'crouch', girl: true, cloth: PINK, hair: '#4a2f22', arms: [18, -2, 22, 4], face: 'smile' }) +
    fig({ x: 218, y: 168, s: 1.35, crutch: true, cloth: '#7ec2b0', arms: [-14, 3, 9, 6], face: 'sad' }) +
    bubble(90, 22, 150, '천천히 일어나. 내가 잡아줄게.', 164, '#fffdf0') +
    sparkle(180, 90, 5) + sparkle(120, 84, 4),

  8: () =>
    bg('#fbf0cf', '#f2dca8', 150) +
    `<circle cx="256" cy="98" r="58" fill="url(#gl)"/><g stroke="#f2c14e" stroke-width="2" opacity=".6">${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `<line x1="${256 + Math.cos(a) * 46}" y1="${98 + Math.sin(a) * 46}" x2="${256 + Math.cos(a) * 62}" y2="${98 + Math.sin(a) * 62}"/>`; }).join('')}</g>` +
    fig({ x: 256, y: 150, s: 1.2, girl: true, cloth: PINK, hair: '#4a2f22', face: 'smile' }) +
    `<path d="M40 180 Q110 120 180 180Z" fill="#79a8dc"/><path d="M62 180 L110 150 L158 180Z" fill="${RED}"/>` +
    `<circle cx="110" cy="92" r="52" fill="${SK}" stroke="${INK}" stroke-width="1.5"/><path d="M58 88 A52 52 0 0 1 162 88 Q110 52 58 88Z" fill="#5b4030"/>` +
    `<circle cx="90" cy="96" r="12" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="130" cy="96" r="12" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="92" cy="97" r="5.5" fill="${INK}"/><circle cx="128" cy="97" r="5.5" fill="${INK}"/><circle cx="94" cy="94" r="1.8" fill="#fff"/><circle cx="130" cy="94" r="1.8" fill="#fff"/>` +
    `<path d="M76 74 Q90 66 102 74" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="M118 74 Q130 66 144 74" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><ellipse cx="110" cy="124" rx="5" ry="6" fill="#b5483c"/>` +
    tx(110, 30, '…!', 16, '#d9483b'),

  9: () =>
    bg('#e7e5f0', '#cfcbdc', 150) +
    fig({ x: 100, y: 222, s: 2.5, cape: 'limp', arms: [-9, 22, 9, 22], face: 'worry', blush: true }) +
    `<circle cx="228" cy="120" r="5" fill="#fff" stroke="${INK}" stroke-width=".8"/><circle cx="216" cy="138" r="3" fill="#fff" stroke="${INK}" stroke-width=".8"/>` +
    `<ellipse cx="258" cy="66" rx="52" ry="42" fill="#fff" stroke="${INK}" stroke-width=".9"/>` +
    fig({ x: 258, y: 104, s: 0.75, girl: true, cloth: PINK, hair: '#4a2f22', face: 'smile' }) + tx(300, 40, '?', 16, '#8a7b68'),

  10: () => {
    const P = (px, py, tint, inner, n) => `<g transform="translate(${px} ${py})"><rect width="150" height="80" rx="6" fill="${tint}" stroke="${INK}" stroke-width="1"/>${inner}${tx(10, 12, n, 10, '#8a7b68')}</g>`;
    return (
      bg('#f6eedb', '#f6eedb', 0) +
      P(6, 6, '#f3f9ec', fig({ x: 62, y: 74, s: 0.95, girl: true, cloth: PINK, hair: '#4a2f22', arms: [-12, 12, 18, -12] }) + fig({ x: 118, y: 74, s: 0.8, cloth: '#e9b58f' }) + tx(100, 22, '안녕!', 9, '#d9483b'), '①') +
      P(164, 6, '#eef4fb', `<rect x="26" y="52" width="46" height="5" fill="#b98a62"/>` + fig({ x: 56, y: 74, s: 0.95, girl: true, cloth: PINK, hair: '#4a2f22', arms: [-12, 12, 14, -26] }) + tx(112, 40, '(손 들고 기다림)', 7, '#8a7b68'), '②') +
      P(6, 94, '#fbf3e6', fig({ x: 54, y: 74, s: 0.95, girl: true, cloth: PINK, hair: '#4a2f22', arms: [-3, -2, 3, -2] }) + fig({ x: 100, y: 74, s: 0.8, cloth: '#e9b58f', face: 'sad' }) + tx(100, 30, '짝짝짝', 9, '#d9483b'), '③') +
      P(164, 94, '#f9f1f3', fig({ x: 50, y: 74, s: 0.95, cape: 'down', face: 'worry' }) + `<rect x="30" y="38" width="40" height="22" fill="#fff" stroke="${INK}" stroke-width=".8"/><line x1="36" y1="46" x2="64" y2="46" stroke="#bbb"/><line x1="36" y1="52" x2="60" y2="52" stroke="#bbb"/>` + fig({ x: 112, y: 74, s: 0.95, girl: true, cloth: PINK, hair: '#4a2f22', face: 'flat' }) + tx(112, 20, '?', 14, '#8a7b68'), '④')
    );
  },

  11: () =>
    bg('#f2e6c8', '#d9b57b', 100) +
    `<line x1="0" y1="138" x2="320" y2="138" stroke="#fff" stroke-width="2" opacity=".7"/><line x1="160" y1="100" x2="160" y2="138" stroke="#fff" stroke-width="2" opacity=".7"/>` +
    fig({ x: 32, y: 168, s: 1, cloth: '#e07b5a', face: 'angry', arms: [-14, -8, 14, -8] }) + fig({ x: 288, y: 168, s: 1, cloth: '#a5c58a', face: 'angry', arms: [-14, -8, 14, -8] }) +
    `<circle cx="228" cy="170" r="7" fill="#d9483b" stroke="${INK}" stroke-width=".8"/>` +
    fig({ x: 160, y: 180, s: 1.9, cape: 'down', arms: [-12, 24, 12, 24], face: 'worry' }) +
    `<path d="M196 66 q4 8 0 11 q-4 -3 0 -11z" fill="#7fc0ee"/>` +
    bubble(52, 20, 74, '다시 해!!', 70, '#ffe3df') + bubble(204, 20, 72, '후우…', 240, '#e3f0ff'),

  12: () =>
    bg('#f4ecd6', '#d6c08e', 135) +
    `<circle cx="72" cy="112" r="48" fill="url(#gl)"/>` +
    fig({ x: 92, y: 168, s: 1.55, cape: 'fly', arms: [-10, 16, 22, -12], face: 'smile' }) + tx(128, 92, '👍', 16) +
    bubble(20, 22, 190, '너네 아까 진짜 잘하더라… 축하해!', 110, '#fffdf0') +
    fig({ x: 172, y: 134, s: 0.82, girl: true, cloth: PINK, hair: '#4a2f22', face: 'wow' }) +
    [[212, '#a5c58a'], [248, '#e9b58f'], [284, '#c3a5d9']].map(([x, c]) => fig({ x, y: 168, s: 1, cloth: c, face: 'wow' })).join('') +
    sparkle(60, 100, 4) + sparkle(46, 120, 3),

  13: () =>
    bg('#f9eed6', '#e3cba4', 120) +
    `<rect x="262" y="82" width="58" height="62" fill="#b9c7d6" stroke="${INK}" stroke-width=".7"/>` +
    fig({ x: 290, y: 124, s: 0.6, girl: true, cloth: PINK, hair: '#4a2f22', face: 'smile' }) +
    fig({ x: 38, y: 166, s: 0.95, cloth: '#a5c58a' }) + fig({ x: 72, y: 166, s: 0.95, cloth: '#c3a5d9' }) +
    fig({ x: 118, y: 168, s: 1.4, cape: 'down', arms: [-12, 10, 24, -2], face: 'smile' }) +
    bubble(40, 22, 130, '내 앞에 서. 천천히 와도 돼.', 118, '#fffdf0') +
    fig({ x: 198, y: 168, s: 1.4, crutch: true, cloth: '#7ec2b0', arms: [-9, 6, 9, 6], face: 'smile', blush: true }) +
    bubble(176, 52, 86, '같이 먹을래?', 200, '#fff') + sparkle(160, 100, 4),

  14: () =>
    bg('#1f2a4a', '#2f3a5c', 130) +
    Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 71) % 300 + 10}" cy="${(i * 37) % 70 + 8}" r="${i % 3 ? 0.8 : 1.3}" fill="#fff" opacity=".7"/>`).join('') +
    `<rect x="20" y="25" width="60" height="70" fill="#0f1a38" stroke="#8a7b68" stroke-width="3"/><line x1="50" y1="25" x2="50" y2="95" stroke="#8a7b68" stroke-width="2"/><circle cx="36" cy="48" r="13" fill="#fdf3b0"/>` +
    `<polygon points="80,50 80,95 160,150 112,150" fill="#fdf3b0" opacity=".16"/>` +
    `<rect x="92" y="112" width="52" height="42" fill="#6b5a7a"/><rect x="98" y="102" width="22" height="10" fill="${RED}" stroke="#a8322a" stroke-width=".8"/>` +
    `<circle cx="132" cy="104" r="22" fill="#f2c14e" opacity=".35"/><rect x="120" y="106" width="22" height="6" fill="#fff"/>` + sparkle(126, 103, 3) + sparkle(136, 101, 3) +
    `<rect x="160" y="108" width="152" height="46" fill="#5a6aa0"/><rect x="164" y="98" width="144" height="24" rx="6" fill="#aab6dd"/><ellipse cx="190" cy="98" rx="22" ry="8" fill="#e8ecf8"/>` +
    fig({ x: 242, y: 106, s: 1.05, rot: -90, cloth: '#79a8dc', face: 'sleep', arms: [-12, 10, 12, 10] }) +
    `<rect x="214" y="96" width="94" height="28" rx="8" fill="#6f7fb8" opacity=".95"/>` +
    tx(196, 74, 'z z', 11, '#dfe6ff'),

  15: () =>
    bg('#d9ecf7', '#cfe0a8', 135) +
    `<circle cx="40" cy="36" r="16" fill="#ffd966"/>` +
    `<rect x="236" y="62" width="76" height="73" fill="#e8c8a0" stroke="${INK}" stroke-width=".8"/><rect x="264" y="104" width="20" height="31" fill="#9c7b5a"/><line x1="274" y1="62" x2="274" y2="34" stroke="${INK}" stroke-width="1.4"/><polygon points="274,34 294,40 274,46" fill="${RED}"/>` +
    `<rect y="150" width="320" height="30" fill="#c9bd9e"/>` +
    fig({ x: 36, y: 164, s: 0.95, cloth: '#c3a5d9' }) + fig({ x: 84, y: 166, s: 1.1, cloth: '#e9b58f', face: 'smile' }) +
    bubble(60, 40, 84, '같이 가자!', 100, '#fff') +
    fig({ x: 170, y: 166, s: 1.4, cape: 'fly', arms: [-20, -12, 14, 10], face: 'smile' }) + speed(130, 132, 3, 22) +
    tx(170, 44, '기다려 줄게!', 11, '#d9483b'),
};

function camOverlay(cam) {
  if (!cam) return '';
  const [fx, fy, fw, fh, ex, ey, ew, eh] = cam;
  const cx1 = fx + fw / 2, cy1 = fy + fh / 2, cx2 = ex + ew / 2, cy2 = ey + eh / 2;
  const same = Math.abs(cx1 - cx2) < 1 && Math.abs(cy1 - cy2) < 1;
  return (
    `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="none" stroke="#1f6fd0" stroke-width="1.6" stroke-dasharray="5 3"/>` +
    `<rect x="${ex}" y="${ey}" width="${ew}" height="${eh}" fill="#d9483b" fill-opacity=".07" stroke="#d9483b" stroke-width="1.8"/>` +
    (same ? '' : `<line x1="${cx1}" y1="${cy1}" x2="${cx2}" y2="${cy2}" stroke="#d9483b" stroke-width="1.6" marker-end="url(#ar)"/>`) +
    `<text x="${fx + 3}" y="${fy + 9}" font-size="8" fill="#1f6fd0" font-weight="700" stroke="#fff" stroke-width=".4">시작</text>` +
    `<text x="${ex + ew - 3}" y="${ey + eh - 3}" font-size="8" fill="#d9483b" font-weight="700" text-anchor="end" stroke="#fff" stroke-width=".4">끝</text>`
  );
}

export function sketch(no, cam) {
  const body = scenes[no]?.() ?? '';
  return (
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" font-family="'Malgun Gothic','Pretendard',sans-serif" role="img" aria-label="장면 ${no} 구도 스케치">` +
    `<defs><radialGradient id="gl"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".95"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>` +
    `<marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#d9483b"/></marker>` +
    `<filter id="pp"><feTurbulence baseFrequency=".8" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .38 0 0 0 0 .3 0 0 0 .22 0"/></filter></defs>` +
    body +
    `<rect width="320" height="180" filter="url(#pp)" opacity=".5"/>` +
    `<g class="cam">${camOverlay(cam)}</g></svg>`
  );
}
