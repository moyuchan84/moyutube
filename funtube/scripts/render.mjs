// 모든(또는 지정한) 에피소드를 out/<id>.mp4 로 렌더링
import { execSync } from "node:child_process";

const all = ["chat", "skit", "facts", "balance", "fight", "ride", "ride3d", "ride3dface", "carpool", "invest", "office", "rush-military", "rush-love"];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all;
for (const id of ids) {
  execSync(`npx remotion render src/index.ts ${id} out/${id}.mp4`, { stdio: "inherit" });
}
