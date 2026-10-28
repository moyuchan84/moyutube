// 음성 도구. 편 폴더 = qna/content/<code>-<slug>/ (아래 <편>)
//   node scripts/voice.mjs ep01 sheet    녹음 대본 → out/ep01/voice-script.md (파일 이름 · 화자 · 대사)
//   node scripts/voice.mjs ep01 studio   AI Studio 붙여넣기 페이지 → out/ep01/voice-studio.html (컷마다 복사 버튼)
//   node scripts/voice.mjs ep01 split    <편>/voice/studio/<컷id>.wav 를 대사 줄마다 잘라 <편>/voice/ 에 넣고 타이밍 갱신 (--all 은 전부 다시 자른다)
//   node scripts/voice.mjs ep01 jobs     컷별 음성 작업 목록 → <편>/prompts/jobs/voice.json (다른 도구에 넘길 때)
//   node scripts/voice.mjs ep01 gen      Gemini API 로 컷별 음성을 받아 바로 split 까지 (유료 — 사용자가 요청할 때만, --all 은 전부 다시)
// 목소리와 말투는 src/voice.json 에 고정돼 있다 (설명: video/VOICE.md)
//   node scripts/voice.mjs ep01          <편>/voice/*.wav 길이를 재서 <편>/script/timing.json 을 다시 쓴다
// 음성 원본은 <편>/voice/ (git). 영상이 읽는 video/public/<code>/voice/ 는 sync 가 만드는 사본이다.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, VIDEO, argCode, episodeDir, scriptPath, studioDir as studioDirOf, voiceDir as voiceDirOf } from "./art-lib.mjs";
import { NO_KEY, envValue } from "./env.mjs";
import { syncUnit } from "./sync.mjs";

const [code, mode] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const episode = argCode(code, "사용: node scripts/voice.mjs <편> [sheet|studio|split|jobs|gen]");
const scriptFile = scriptPath(episode, "script.json");
const script = JSON.parse(readFileSync(scriptFile, "utf8"));
const VOICE = JSON.parse(readFileSync(join(VIDEO, "src/voice.json"), "utf8"));
const WHO = { narr: "나레이션", dad: "아빠", kid: "아이", docu: "다큐 톤(낮고 진지하게)", granny: "할머니" };
const lines = script.cuts.flatMap((cut) => cut.lines.map((line, i) => ({ id: `${cut.id}-${i}`, beat: cut.beat, ...line })));

const voiceDir = voiceDirOf(episode);
const studioDir = studioDirOf(episode); // AI Studio에서 받은 컷별 원본
const lockFile = join(voiceDir, "voice-lock.json"); // 자를 때의 대사 지문과 원본 시각. 대사가 바뀐 컷을 찾는 데 쓴다
const unitRel = `qna/${episodeDir(episode)}`;
const spoken = (line) => line.tts ?? line.text;
const cutHash = (cut) => createHash("sha1").update(JSON.stringify(cut.lines.map((l) => [l.who, spoken(l)]))).digest("hex").slice(0, 12);
const readLock = () => (existsSync(lockFile) ? JSON.parse(readFileSync(lockFile, "utf8")) : {});

// WAV(16비트 PCM)를 읽는다
// AI Studio 파일은 WAV 안에 WAV 가 한 번 더 들어 있고(헤더 44바이트), 끝에는 "AI 생성" 표시(C2PA)가 붙어 있다.
// 그걸 소리로 읽으면 컷의 첫머리와 끝에서 "칙" 하는 잡음이 난다. 안쪽 WAV 의 data 만 꺼낸다
const readWav = (file, buf = readFileSync(file)) => {
  if (buf.toString("ascii", 0, 4) !== "RIFF") throw new Error(`${file}: WAV 파일이 아니다`);
  let fmt = null;
  for (let p = 12; p + 8 <= buf.length; ) {
    const id = buf.toString("ascii", p, p + 4);
    const size = buf.readUInt32LE(p + 4);
    if (id === "fmt ") {
      fmt = { channels: buf.readUInt16LE(p + 10), rate: buf.readUInt32LE(p + 12), bits: buf.readUInt16LE(p + 22) };
      // 헤더의 byteRate 는 믿지 않는다 (AI Studio 파일은 두 배로 적혀 있다)
      fmt.byteRate = (fmt.rate * fmt.channels * fmt.bits) / 8;
    }
    if (id === "data") {
      const data = buf.subarray(p + 8, p + 8 + Math.min(size, buf.length - p - 8));
      if (data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WAVE") return readWav(file, data);
      // 안쪽 WAV 가 없는데 끝에 C2PA 상자(jumb)만 붙은 경우
      const box = data.indexOf("jumb");
      return { ...fmt, data: box >= 4 ? data.subarray(0, (box - 4) & ~1) : data };
    }
    p += 8 + size + (size % 2);
  }
  throw new Error(`${file}: WAV 파일이 아니다`);
};

const seconds = (file) => {
  const wav = readWav(file);
  return wav.data.length / wav.byteRate;
};

const writeWav = (file, wav, data) => {
  const head = Buffer.alloc(44);
  head.write("RIFF", 0, "ascii");
  head.writeUInt32LE(36 + data.length, 4);
  head.write("WAVEfmt ", 8, "ascii");
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20);
  head.writeUInt16LE(wav.channels, 22);
  head.writeUInt32LE(wav.rate, 24);
  head.writeUInt32LE(wav.byteRate, 28);
  head.writeUInt16LE(wav.channels * 2, 32);
  head.writeUInt16LE(16, 34);
  head.write("data", 36, "ascii");
  head.writeUInt32LE(data.length, 40);
  writeFileSync(file, Buffer.concat([head, data]));
};

const writeTiming = () => {
  const timing = {};
  const missing = [];
  for (const l of lines) {
    const file = join(voiceDir, `${l.id}.wav`);
    if (existsSync(file)) timing[l.id] = Math.round(seconds(file) * 1000) / 1000;
    else missing.push(l.id);
  }
  if (missing.length) throw new Error(`음성 파일이 없다: ${missing.join(", ")}`);
  writeFileSync(scriptPath(episode, "timing.json"), `${JSON.stringify(timing, null, 2)}\n`);
  const total = Object.values(timing).reduce((a, b) => a + b, 0);
  console.log(`timing.json 갱신: ${lines.length}줄, 말하는 시간 ${(total / 60).toFixed(1)}분`);
};

// 컷 하나의 음성을 대사 n줄로 자른다: 말소리 사이의 무음 n-1곳이 줄 경계다.
// 가장 긴 무음만 고르면 줄 안의 긴 쉼("음, …")에 속으므로, 글자 수로 예상한 줄 길이와 가장 잘 맞는 조합을 고른다
const FRAME = 0.01; // 초
const PAD = 0.05; // 잘린 조각 앞뒤에 남기는 여유(초)
const MIN_GAP = 0.15; // 이보다 짧은 무음은 줄 경계로 보지 않는다(초)
const GAP_BONUS = 0.4; // 무음 1초가 길이 오차를 얼마나 덮어 주는가
const weightOf = (line) => Math.max(3, spoken(line).replace(/[^가-힣a-zA-Z0-9]/g, "").length + 2 * (spoken(line).match(/[,.?!]/g) ?? []).length);
const splitWav = (wav, n, weights = null) => {
  if (wav.bits !== 16) throw new Error("16비트 PCM WAV만 자를 수 있다");
  const step = wav.channels * 2;
  const perFrame = Math.round(wav.rate * FRAME);
  const frames = Math.floor(wav.data.length / step / perFrame);
  const rms = new Float64Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    for (let s = 0; s < perFrame * wav.channels; s++) {
      const v = wav.data.readInt16LE((f * perFrame * wav.channels + s) * 2);
      sum += v * v;
    }
    rms[f] = Math.sqrt(sum / (perFrame * wav.channels));
  }
  const floor = Math.max(...rms) * 0.02;
  const loud = (f) => rms[f] > floor;
  let first = 0;
  let last = frames - 1;
  while (first < frames && !loud(first)) first++;
  while (last > first && !loud(last)) last--;
  const gaps = [];
  for (let f = first; f <= last; f++) {
    if (loud(f)) continue;
    let end = f;
    while (!loud(end + 1)) end++;
    gaps.push({ from: f, to: end + 1, len: end + 1 - f });
    f = end;
  }
  if (gaps.length < n - 1) throw new Error(`대사는 ${n}줄인데 쉬는 곳을 ${gaps.length}곳밖에 못 찾았다`);
  let chosen = [];
  let unsure = false;
  if (n > 1 && weights) {
    const long = gaps.filter((g) => g.len * FRAME >= MIN_GAP);
    const cand = long.length >= n - 1 ? long : gaps;
    const total = weights.reduce((a, b) => a + b, 0);
    const expect = (i) => ((last + 1 - first) * weights[i]) / total;
    const cost = (from, to, i) => (to > from ? Math.log((to - from) / expect(i)) ** 2 : Infinity);
    const bonus = (g) => GAP_BONUS * Math.min(g.len * FRAME, 1.5);
    // best[i][j]: i번째 줄이 cand[j] 에서 끝날 때의 가장 작은 오차
    const best = [cand.map((g) => cost(first, g.from, 0) - bonus(g))];
    const back = [cand.map(() => -1)];
    for (let i = 1; i < n - 1; i++) {
      best.push(cand.map(() => Infinity));
      back.push(cand.map(() => -1));
      for (let j = i; j < cand.length; j++) {
        for (let k = i - 1; k < j; k++) {
          const c = best[i - 1][k] + cost(cand[k].to, cand[j].from, i) - bonus(cand[j]);
          if (c < best[i][j]) [best[i][j], back[i][j]] = [c, k];
        }
      }
    }
    let end = -1;
    let low = Infinity;
    cand.forEach((g, j) => {
      const c = best[n - 2][j] + cost(g.to, last + 1, n - 1);
      if (c < low) [low, end] = [c, j];
    });
    for (let i = n - 2, j = end; i >= 0; j = back[i][j], i--) chosen.unshift(cand[j]);
    // 예상 길이와 두 배 넘게 어긋난 줄이 있으면 잘못 잘랐을 수 있다
    const cuts = [first, ...chosen.flatMap((g) => [g.from, g.to]), last + 1];
    unsure = weights.some((_, i) => Math.abs(Math.log((cuts[i * 2 + 1] - cuts[i * 2]) / expect(i))) > Math.log(2));
  } else if (n > 1) {
    gaps.sort((a, b) => b.len - a.len);
    chosen = gaps.slice(0, n - 1).sort((a, b) => a.from - b.from);
  }
  const edges = [first, ...chosen.flatMap((g) => [g.from, g.to]), last + 1];
  const pad = Math.round(PAD / FRAME);
  const pieces = [];
  for (let i = 0; i < n; i++) {
    const from = Math.max(0, edges[i * 2] - pad);
    const to = Math.min(frames, edges[i * 2 + 1] + pad);
    pieces.push(wav.data.subarray(from * perFrame * step, to * perFrame * step));
  }
  return { pieces, unsure };
};

// 화자: 나레이션·아빠·다큐 톤은 한 사람(Speaker 1), 아이는 Speaker 2. 목소리와 말투는 src/voice.json
const speakerOf = (who) => VOICE.speakers.find((sp) => sp.roles.includes(who)) ?? VOICE.speakers[0];
const ACTING = VOICE.acting;
const SLOTS = ["Speaker 1", "Speaker 2"];
// 이 컷에 나오는 목소리와 그 컷에서의 이름표. AI Studio 는 한 번에 두 목소리까지라, 손님(할머니)은 비는 자리를 쓴다
const castOf = (cut) => {
  const speakers = VOICE.speakers.filter((sp) => cut.lines.some((l) => speakerOf(l.who) === sp));
  if (speakers.length > 2) throw new Error(`${cut.id}: 한 컷에 목소리가 ${speakers.length}개다 (${speakers.map((sp) => sp.voice).join(", ")}). 두 개까지만 되니 컷을 나눈다`);
  const taken = speakers.map((sp) => sp.label).filter((label) => SLOTS.includes(label));
  const free = SLOTS.filter((label) => !taken.includes(label));
  return speakers.map((sp) => ({ ...sp, slot: SLOTS.includes(sp.label) ? sp.label : free.shift() }));
};
const slotOf = (cast, who) => cast.find((sp) => sp.roles.includes(who)) ?? cast[0];
const studioText = (cut) => {
  const cast = castOf(cut);
  const style = [VOICE.direction, ...cast.map((sp) => `${sp.slot}: ${sp.style}.`)].join(" ");
  const notes = cut.lines.filter((l) => ACTING[l.who]).map((l) => `The line "${spoken(l)}" ${ACTING[l.who]}.`);
  const body = cut.lines.map((l) => `${slotOf(cast, l.who).slot}: ${spoken(l)}`);
  return [style, ...notes, "", ...body].join("\n");
};
const voicesOf = (cut) => castOf(cut).map((sp) => `${sp.slot} = ${sp.voice}`).join(" · ");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

if (mode === "jobs") {
  const lock = readLock();
  const jobs = script.cuts
    .filter((cut) => cut.lines.length)
    .map((cut) => {
      const cast = castOf(cut);
      return {
        cut: cut.id,
        save: `${unitRel}/voice/studio/${cut.id}.wav`,
        done: lock[cut.id]?.text === cutHash(cut),
        speakers: cast.map((sp) => ({ speaker: sp.slot, voice: sp.voice, who: sp.name ?? sp.roles.join("/"), style: sp.style })),
        lines: cut.lines.map((l) => {
          const sp = slotOf(cast, l.who);
          return { speaker: sp.slot, who: l.who, text: spoken(l), style: ACTING[l.who] ? `${sp.style}. This line ${ACTING[l.who]}` : sp.style };
        }),
        prompt: studioText(cut),
      };
    });
  const dir = join(ROOT, episodeDir(episode), "prompts", "jobs");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "voice.json"),
    `${JSON.stringify({ episode, title: script.title, engine: VOICE.engine, format: "WAV, 24 kHz, 16-bit, mono. One file per cut, all lines of the cut in order.", direction: VOICE.direction, jobs }, null, 2)}\n`,
  );
  console.log(`${unitRel}/prompts/jobs/voice.json — ${jobs.length}컷 (남은 컷 ${jobs.filter((j) => !j.done).length})`);
} else if (mode === "sheet") {
  const outDir = join(VIDEO, "out", episode);
  mkdirSync(outDir, { recursive: true });
  let beat = null;
  const rows = lines.map((l) => {
    const head = l.beat !== beat ? `\n## ${(beat = l.beat) || "기타"}\n\n` : "";
    return `${head}- \`${l.id}.wav\` · **${WHO[l.who] ?? l.who}** — ${l.text}`;
  });
  writeFileSync(
    join(outDir, "voice-script.md"),
    `# ${script.title} — 녹음 대본 (${lines.length}줄)\n\n한 줄을 한 파일로 녹음해 \`${unitRel}/voice/\` 에 같은 이름의 WAV로 넣는다.\n앞뒤 무음은 0.1초 안쪽으로 자른다. 다 넣은 뒤 \`npm run voice -- ${episode}\`.\n${rows.join("\n")}\n`,
  );
  console.log(`out/${episode}/voice-script.md (${lines.length}줄)`);
} else if (mode === "studio") {
  const outDir = join(VIDEO, "out", episode);
  mkdirSync(outDir, { recursive: true });
  const lock = readLock();
  const cuts = script.cuts.filter((cut) => cut.lines.length);
  const state = (cut) => {
    if (lock[cut.id]?.text === cutHash(cut)) return ["ok", "✅ 완료"];
    if (lock[cut.id]) return ["stale", "⚠ 대사가 바뀜 — 다시 생성"];
    return ["todo", "⬜ 아직"];
  };
  const todo = cuts.filter((cut) => state(cut)[0] !== "ok");
  const cards = cuts.map((cut) => {
    const [cls, label] = state(cut);
    return `<section class="${cls}"><header><b>${cut.id}.wav</b><span>${esc(cut.beat ?? "")} · ${cut.lines.length}줄</span><span class="v${castOf(cut).some((sp) => !SLOTS.includes(sp.label)) ? " guest" : ""}">${esc(voicesOf(cut))}</span><em>${label}</em><button>복사</button></header><pre>${esc(studioText(cut))}</pre></section>`;
  });
  writeFileSync(
    join(outDir, "voice-studio.html"),
    `<!doctype html><html lang="ko"><meta charset="utf-8"><title>${esc(script.title)} — AI Studio 음성</title>
<style>
body{font:16px/1.6 'Pretendard Variable',system-ui,sans-serif;max-width:860px;margin:32px auto;padding:0 16px;background:#E9EDE8;color:#1B2A26}
h1{font-size:22px}ol{padding-left:20px}code{background:#DFE6DE;padding:1px 5px;border-radius:4px}
section{background:#F6F8F4;border:2px solid #C4D0C6;border-radius:8px;margin:14px 0;padding:12px 14px}
section.ok{opacity:.55}section.stale{border-color:#B8352A}section.copied{border-color:#1B2A26}
header{display:flex;gap:12px;align-items:center;flex-wrap:wrap}header span{color:#66756E}header em{font-style:normal;margin-left:auto}
header span.v{font-weight:700;color:#1B2A26}header span.v.guest{color:#fff;background:#8A5A2B;padding:1px 8px;border-radius:4px}
button{font:inherit;font-weight:700;padding:6px 18px;border:0;border-radius:6px;background:#B8352A;color:#fff;cursor:pointer}
pre{white-space:pre-wrap;word-break:break-word;font:14px/1.6 ui-monospace,monospace;margin:10px 0 0}
</style>
<h1>${esc(script.title)} — AI Studio 음성 (남은 컷 ${todo.length} / ${cuts.length})</h1>
<ol>
<li><a href="https://aistudio.google.com/generate-speech" target="_blank">AI Studio 음성 생성</a>을 열고 <b>여러 화자(Multi-speaker)</b> 모드로 둔다. 목소리는 기본이 ${VOICE.speakers.filter((sp) => SLOTS.includes(sp.label)).map((sp) => `${sp.label} = <b>${sp.voice}</b>`).join(", ")} 이고, <b>카드에 갈색으로 표시된 컷</b>은 거기 적힌 대로 바꾼다 (${VOICE.speakers.filter((sp) => !SLOTS.includes(sp.label)).map((sp) => `${sp.name} = <b>${sp.voice}</b>`).join(", ") || "손님 목소리 없음"}). 설명은 <code>video/VOICE.md</code>.</li>
<li>아래 컷의 <b>복사</b>를 누르고, 대본 칸(Raw structure)을 비운 뒤 붙여넣어 생성한다.</li>
<li>받은 파일을 카드에 적힌 이름(예: <code>c01.wav</code>)으로 바꿔 <code>${unitRel}/voice/studio/</code> 에 넣는다.</li>
<li>다 넣었으면(일부만 넣어도 된다) <code>npm run voice -- ${episode} split</code> — 줄마다 자르고 타이밍을 맞춘다.</li>
</ol>
${cards.join("\n")}
<script>
for (const b of document.querySelectorAll("button")) b.onclick = async () => {
  const card = b.closest("section"), text = card.querySelector("pre").textContent;
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement("textarea"); t.value = text; document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
  card.classList.add("copied"); b.textContent = "복사됨";
};
</script></html>
`,
  );
  console.log(`out/${episode}/voice-studio.html — 남은 컷 ${todo.length} / ${cuts.length}${todo.length ? `: ${todo.map((c) => c.id).join(", ")}` : ""}`);
} else if (mode === "split" || mode === "gen") {
  mkdirSync(voiceDir, { recursive: true });
  const lock = readLock();
  const force = mode === "split" && process.argv.includes("--all"); // 이미 자른 컷도 다시 자른다
  const direct = mode === "gen" ? await generate(lock) : new Set(); // 줄마다 따로 받아 이미 잘려 있는 컷
  const done = [...direct];
  const waiting = [];
  for (const cut of script.cuts) {
    if (!cut.lines.length || direct.has(cut.id)) continue;
    const file = join(studioDir, `${cut.id}.wav`);
    const fresh = lock[cut.id]?.text === cutHash(cut);
    const stamp = existsSync(file) ? statSync(file).mtimeMs : null;
    // 원본이 없거나, 대사는 바뀌었는데 원본은 예전 것 그대로다
    if (!stamp || (!force && lock[cut.id]?.wav === stamp)) {
      if (!fresh) waiting.push(cut.id);
      continue;
    }
    const wav = readWav(file);
    let result;
    try {
      result = splitWav(wav, cut.lines.length, cut.lines.map(weightOf));
    } catch (e) {
      throw new Error(`${cut.id}.wav: ${e.message}. 다시 생성하거나, 줄마다 직접 잘라 ${unitRel}/voice 에 넣는다`);
    }
    clearCut(cut);
    console.log(`${cut.id}${result.unsure ? "  ⚠ 줄 경계가 애매하다. 아래 길이가 대사와 맞는지 확인" : ""}`);
    result.pieces.forEach((data, i) => {
      writeWav(join(voiceDir, `${cut.id}-${i}.wav`), wav, data);
      console.log(`  ${(data.length / wav.byteRate).toFixed(1).padStart(5)}초  ${spoken(cut.lines[i]).slice(0, 40)}`);
    });
    lock[cut.id] = { text: cutHash(cut), wav: stamp };
    done.push(cut.id);
  }
  if (!done.length) console.log(`${unitRel}/voice/studio/ 에 새로 받은 <컷id>.wav 가 없다.`);
  if (done.length) {
    writeFileSync(lockFile, `${JSON.stringify(lock, null, 2)}\n`);
    writeTiming();
    syncUnit(episode);
  }
  if (waiting.length) console.log(`아직 AI Studio 음성이 없거나 대사가 바뀐 컷: ${waiting.join(", ")}`);
  else if (!script.rawVoice) {
    // 전부 AI 음성이 됐으면 렌더할 때 음높이를 건드리지 않게 한다
    writeFileSync(scriptFile, readFileSync(scriptFile, "utf8").replace(/^\{\s*\n/, '{\n  "rawVoice": true,\n'));
    console.log(`${unitRel}/script/script.json 에 "rawVoice": true 를 넣었다 (목소리 변조 끔).`);
  }
} else {
  writeTiming();
}

// 줄 수가 줄었을 때 남는 옛 파일을 지운다
function clearCut(cut) {
  for (const name of readdirSync(voiceDir)) if (name.startsWith(`${cut.id}-`)) rmSync(join(voiceDir, name));
}

// Gemini API 로 대사가 바뀐 컷의 음성을 받는다. 컷 하나를 한 번에 받아 voice-studio 에 두고(자르기는 split 이 한다),
// 쉬는 곳을 못 찾는 컷은 줄마다 따로 받아 바로 public 에 넣는다. 그렇게 넣은 컷 id 를 돌려준다
async function generate(lock) {
  const key1 = envValue("GEMINI_API_KEY") ?? envValue("GOOGLE_API_KEY");
  const key2 = envValue("GEMINI_API_KEY2");
  const keys = [...new Set([key1, key2].filter(Boolean))];
  if (!keys.length) throw new Error(NO_KEY);
  let keyIndex = 0;
  let dailyHits = 0;
  const API = "https://generativelanguage.googleapis.com/v1beta";
  const call = async (path, body) => {
    for (let attempt = 1; ; attempt++) {
      const currentKey = keys[keyIndex % keys.length];
      const res = await fetch(`${API}/${path}`, {
        method: body ? "POST" : "GET",
        headers: { "x-goog-api-key": currentKey, "content-type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.ok) return res.json();
      const text = await res.text();
      if (res.status === 429 && /PerDay/i.test(text)) {
        // 키를 한 바퀴 다 돌았는데도 일일 한도면 멈춘다 (전환만 끝없이 되풀이하지 않게)
        if (keys.length > 1 && ++dailyHits < keys.length) {
          console.log(`  일일 한도 도달 — 다음 API 키로 전환`);
          keyIndex++;
          continue;
        }
        throw new Error(`모든 API 키가 이 모델의 일일 한도에 걸렸다. 내일 다시 하거나 크롬 AI Studio 로 남은 줄을 만든다`);
      }
      dailyHits = 0;
      if ((res.status === 429 || res.status >= 500) && attempt < 10) {
        console.log(`  ${res.status} — 60초 뒤 다시 시도 (${attempt}/9)`);
        await new Promise((r) => setTimeout(r, 60000));
        continue;
      }
      throw new Error(`Gemini API ${res.status}: ${text.slice(0, 400)}`);
    }
  };

  // 모델: 환경변수 → voice.json → 계정에서 쓸 수 있는 Flash TTS 중 가장 새것
  let model = process.env.GEMINI_TTS_MODEL ?? VOICE.model;
  if (!model) {
    const { models = [] } = await call("models?pageSize=1000");
    const version = (name) => Number(name.match(/gemini-(\d+(?:\.\d+)?)/)?.[1] ?? 0);
    const tts = models
      .filter((m) => /tts/.test(m.name) && m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name.replace(/^models\//, ""))
      .sort((a, b) => /flash/.test(b) - /flash/.test(a) || version(b) - version(a));
    if (!tts.length) throw new Error("이 키로 쓸 수 있는 TTS 모델이 없다. src/voice.json 의 model 에 직접 적는다");
    model = tts[0];
  }
  console.log(`모델 ${model} · ${VOICE.speakers.map((sp) => `${sp.name ?? sp.label}=${sp.voice}`).join(" · ")}`);

  // 여러 화자 요청은 목소리가 꼭 둘이어야 해서, 한 사람만 말하는 컷은 안 쓰는 목소리로 자리를 채운다
  const configOf = (cast) => {
    const filled = [...cast];
    for (const label of SLOTS) {
      if (filled.some((sp) => sp.slot === label)) continue;
      const spare = VOICE.speakers.find((sp) => !filled.some((used) => used.voice === sp.voice));
      filled.push({ ...spare, slot: label });
    }
    return {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: filled.map((sp) => ({
          speaker: sp.slot,
          voiceConfig: { prebuiltVoiceConfig: { voiceName: sp.voice } },
        })),
      },
    };
  };
  const speakCut = async (cut) => {
    const cast = castOf(cut);
    const speechConfig = configOf(cast);
    const parts = cut.lines.map((l) => {
      const sp = slotOf(cast, l.who);
      const style = ACTING[l.who] ? `${sp.style}. This line ${ACTING[l.who]}` : sp.style;
      return {
        text: spoken(l),
        speechMetadata: { speaker: sp.slot, style },
      };
    });
    const json = await call(`models/${model}:generateContent`, {
      contents: [{ parts }],
      generationConfig: { responseModalities: ["AUDIO"], speechConfig },
    });
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) throw new Error(`음성이 안 왔다: ${JSON.stringify(json).slice(0, 300)}`);
    const rate = Number(part.inlineData.mimeType?.match(/rate=(\d+)/)?.[1] ?? 24000);
    return { channels: 1, rate, bits: 16, byteRate: rate * 2, data: Buffer.from(part.inlineData.data, "base64") };
  };
  const speakLine = async (line) => {
    const cast = castOf({ id: "line", lines: [line] });
    const speechConfig = configOf(cast);
    const sp = cast[0];
    const style = ACTING[line.who] ? `${sp.style}. This line ${ACTING[line.who]}` : sp.style;
    const parts = [{ text: spoken(line), speechMetadata: { speaker: sp.slot, style } }];
    const json = await call(`models/${model}:generateContent`, {
      contents: [{ parts }],
      generationConfig: { responseModalities: ["AUDIO"], speechConfig },
    });
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) throw new Error(`음성이 안 왔다: ${JSON.stringify(json).slice(0, 300)}`);
    const rate = Number(part.inlineData.mimeType?.match(/rate=(\d+)/)?.[1] ?? 24000);
    return { channels: 1, rate, bits: 16, byteRate: rate * 2, data: Buffer.from(part.inlineData.data, "base64") };
  };

  mkdirSync(studioDir, { recursive: true });
  const all = process.argv.includes("--all");
  const direct = new Set();
  for (const cut of script.cuts) {
    if (!cut.lines.length || (!all && (existsSync(join(studioDir, `${cut.id}.wav`)) || lock[cut.id]?.text === cutHash(cut)))) continue;
    console.log(`${cut.id} 생성 (${cut.lines.length}줄)`);
    const wav = await speakCut(cut);
    try {
      splitWav(wav, cut.lines.length, cut.lines.map(weightOf));
      writeWav(join(studioDir, `${cut.id}.wav`), wav, wav.data);
    } catch {
      console.log("  쉬는 곳을 못 찾아 줄마다 따로 받는다");
      clearCut(cut);
      for (const [i, line] of cut.lines.entries()) {
        const one = await speakLine(line);
        writeWav(join(voiceDir, `${cut.id}-${i}.wav`), one, splitWav(one, 1).pieces[0]);
      }
      lock[cut.id] = { text: cutHash(cut), wav: null };
      direct.add(cut.id);
    }
    await new Promise((r) => setTimeout(r, 8000));
  }
  return direct;
}
