// vite.config.ts
import { defineConfig } from "file:///D:/youtube/lab/node_modules/vite/dist/node/index.js";
import fs from "node:fs";
import path from "node:path";
import motionCanvasModule from "file:///D:/youtube/lab/node_modules/@motion-canvas/vite-plugin/lib/index.js";
import ffmpegModule from "file:///D:/youtube/lab/node_modules/@motion-canvas/ffmpeg/lib/server/index.js";
var unwrap = (m) => typeof m === "function" ? m : m.default;
var motionCanvas = unwrap(motionCanvasModule);
var ffmpeg = unwrap(ffmpegModule);
function cueSink() {
  return {
    name: "lab-cue-sink",
    configureServer(server) {
      server.middlewares.use("/__cues", (req, res) => {
        const name = (req.url ?? "").replace(/^\//, "").replace(/[^\w-]/g, "");
        let body = "";
        req.on("data", (c) => body += c);
        req.on("end", () => {
          if (name && body) {
            const file = path.resolve("audio", `${name}.cues.json`);
            const next = JSON.stringify(JSON.parse(body), null, 1);
            if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== next) {
              fs.mkdirSync("audio", { recursive: true });
              fs.writeFileSync(file, next);
            }
          }
          res.end("ok");
        });
      });
    }
  };
}
var projects = [
  "circleLength",
  "circleArea",
  "triAngles",
  "triArea",
  "triObtuse",
  "triShear",
  "mulSwap",
  "mulColumn",
  "mulSquare",
  "mulOdd",
  "mulRoot",
  "mulRoot2",
  "blindSpot",
  "afterImage",
  "motionAfter",
  "grayColor",
  "fracAdd",
  "fracDiv",
  "unitArea",
  "diffTangent",
  "magnetCut",
  "moonPhase",
  "seasons",
  "rulerCatch",
  "ringFinger",
  "shepard",
  "stroop",
  "shadowCheck",
  "domEye",
  "fingerSausage",
  "sideRead",
  "fadeDots",
  "mvtSpeed",
  "integArea",
  "ftcRoller",
  "logRule",
  "eCompound",
  "radianRope",
  "sinShadow",
  "geoSquare",
  "bayesTest",
  "dotShadow",
  "dominoProof",
  "arrowFins",
  "magicBoard",
  "magic1089",
  "chunkMemo",
  "slowChange",
  "passCount"
];
var vite_config_default = defineConfig({
  server: { watch: { ignored: ["**/audio/*.cues.json", "**/output/**"] } },
  plugins: [cueSink(), motionCanvas({ project: projects.map((p) => `./src/${p}.ts`) }), ffmpeg()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx5b3V0dWJlXFxcXGxhYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxceW91dHViZVxcXFxsYWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3lvdXR1YmUvbGFiL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWcsIHR5cGUgUGx1Z2lufSBmcm9tICd2aXRlJztcclxuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xyXG5pbXBvcnQgbW90aW9uQ2FudmFzTW9kdWxlIGZyb20gJ0Btb3Rpb24tY2FudmFzL3ZpdGUtcGx1Z2luJztcclxuaW1wb3J0IGZmbXBlZ01vZHVsZSBmcm9tICdAbW90aW9uLWNhbnZhcy9mZm1wZWcnO1xyXG5cclxuLy8gXHVCNDUwIFx1RDMyOFx1RDBBNFx1QzlDMFx1QjI5NCBDSlMgXHVCNzdDXHVDMTFDIEVTTSBcdUMxMjRcdUM4MTVcdUM1RDBcdUMxMUMgZGVmYXVsdCBcdUFDMDAgXHVENTVDIFx1QUNCOSBcdUIzNTQgXHVBQzEwXHVDMkY4XHVDNUVDIFx1QzYyOFx1QjJFNFxyXG5jb25zdCB1bndyYXAgPSAobTogYW55KSA9PiAodHlwZW9mIG0gPT09ICdmdW5jdGlvbicgPyBtIDogbS5kZWZhdWx0KTtcclxuY29uc3QgbW90aW9uQ2FudmFzID0gdW53cmFwKG1vdGlvbkNhbnZhc01vZHVsZSk7XHJcbmNvbnN0IGZmbXBlZyA9IHVud3JhcChmZm1wZWdNb2R1bGUpO1xyXG5cclxuLy8gXHVDN0E1XHVCQTc0XHVDNzc0IFx1QjA1RFx1QUU0Q1x1QzlDMCBcdUIzQ0NcdUJBNzQgXHVENkE4XHVBQ0ZDXHVDNzRDIFx1RDA1MChcdUMyRENcdUFDMDEgXHUwMEI3IFx1Qzg4NVx1Qjk1OClcdUI5N0MgUE9TVCBcdUI4NUMgXHVCQ0Y0XHVCMEI4XHVCMkU0IFx1MjE5MiBhdWRpby88XHVDNzc0XHVCOTg0Pi5jdWVzLmpzb24gKHNjcmlwdHMvYmdtLm1qcyBcdUFDMDAgXHVDNzdEXHVDNzRDKVxyXG5mdW5jdGlvbiBjdWVTaW5rKCk6IFBsdWdpbiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6ICdsYWItY3VlLXNpbmsnLFxyXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvX19jdWVzJywgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IChyZXEudXJsID8/ICcnKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1teXFx3LV0vZywgJycpO1xyXG4gICAgICAgIGxldCBib2R5ID0gJyc7XHJcbiAgICAgICAgcmVxLm9uKCdkYXRhJywgYyA9PiAoYm9keSArPSBjKSk7XHJcbiAgICAgICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAobmFtZSAmJiBib2R5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBwYXRoLnJlc29sdmUoJ2F1ZGlvJywgYCR7bmFtZX0uY3Vlcy5qc29uYCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKGJvZHkpLCBudWxsLCAxKTtcclxuICAgICAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGUpIHx8IGZzLnJlYWRGaWxlU3luYyhmaWxlLCAndXRmOCcpICE9PSBuZXh0KSB7XHJcbiAgICAgICAgICAgICAgZnMubWtkaXJTeW5jKCdhdWRpbycsIHtyZWN1cnNpdmU6IHRydWV9KTtcclxuICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGUsIG5leHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXMuZW5kKCdvaycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgcHJvamVjdHMgPSBbXHJcbiAgJ2NpcmNsZUxlbmd0aCcsXHJcbiAgJ2NpcmNsZUFyZWEnLFxyXG4gICd0cmlBbmdsZXMnLFxyXG4gICd0cmlBcmVhJyxcclxuICAndHJpT2J0dXNlJyxcclxuICAndHJpU2hlYXInLFxyXG4gICdtdWxTd2FwJyxcclxuICAnbXVsQ29sdW1uJyxcclxuICAnbXVsU3F1YXJlJyxcclxuICAnbXVsT2RkJyxcclxuICAnbXVsUm9vdCcsXHJcbiAgJ211bFJvb3QyJyxcclxuICAnYmxpbmRTcG90JyxcclxuICAnYWZ0ZXJJbWFnZScsXHJcbiAgJ21vdGlvbkFmdGVyJyxcclxuICAnZ3JheUNvbG9yJyxcclxuICAnZnJhY0FkZCcsXHJcbiAgJ2ZyYWNEaXYnLFxyXG4gICd1bml0QXJlYScsXHJcbiAgJ2RpZmZUYW5nZW50JyxcclxuICAnbWFnbmV0Q3V0JyxcclxuICAnbW9vblBoYXNlJyxcclxuICAnc2Vhc29ucycsXHJcbiAgJ3J1bGVyQ2F0Y2gnLFxyXG4gICdyaW5nRmluZ2VyJyxcclxuICAnc2hlcGFyZCcsXHJcbiAgJ3N0cm9vcCcsXHJcbiAgJ3NoYWRvd0NoZWNrJyxcclxuICAnZG9tRXllJyxcclxuICAnZmluZ2VyU2F1c2FnZScsXHJcbiAgJ3NpZGVSZWFkJyxcclxuICAnZmFkZURvdHMnLFxyXG4gICdtdnRTcGVlZCcsXHJcbiAgJ2ludGVnQXJlYScsXHJcbiAgJ2Z0Y1JvbGxlcicsXHJcbiAgJ2xvZ1J1bGUnLFxyXG4gICdlQ29tcG91bmQnLFxyXG4gICdyYWRpYW5Sb3BlJyxcclxuICAnc2luU2hhZG93JyxcclxuICAnZ2VvU3F1YXJlJyxcclxuICAnYmF5ZXNUZXN0JyxcclxuICAnZG90U2hhZG93JyxcclxuICAnZG9taW5vUHJvb2YnLFxyXG4gICdhcnJvd0ZpbnMnLFxyXG4gICdtYWdpY0JvYXJkJyxcclxuICAnbWFnaWMxMDg5JyxcclxuICAnY2h1bmtNZW1vJyxcclxuICAnc2xvd0NoYW5nZScsXHJcbiAgJ3Bhc3NDb3VudCcsXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHNlcnZlcjoge3dhdGNoOiB7aWdub3JlZDogWycqKi9hdWRpby8qLmN1ZXMuanNvbicsICcqKi9vdXRwdXQvKionXX19LFxyXG4gIHBsdWdpbnM6IFtjdWVTaW5rKCksIG1vdGlvbkNhbnZhcyh7cHJvamVjdDogcHJvamVjdHMubWFwKHAgPT4gYC4vc3JjLyR7cH0udHNgKX0pLCBmZm1wZWcoKV0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtPLFNBQVEsb0JBQWdDO0FBQzFRLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUNqQixPQUFPLHdCQUF3QjtBQUMvQixPQUFPLGtCQUFrQjtBQUd6QixJQUFNLFNBQVMsQ0FBQyxNQUFZLE9BQU8sTUFBTSxhQUFhLElBQUksRUFBRTtBQUM1RCxJQUFNLGVBQWUsT0FBTyxrQkFBa0I7QUFDOUMsSUFBTSxTQUFTLE9BQU8sWUFBWTtBQUdsQyxTQUFTLFVBQWtCO0FBQ3pCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGdCQUFnQixRQUFRO0FBQ3RCLGFBQU8sWUFBWSxJQUFJLFdBQVcsQ0FBQyxLQUFLLFFBQVE7QUFDOUMsY0FBTSxRQUFRLElBQUksT0FBTyxJQUFJLFFBQVEsT0FBTyxFQUFFLEVBQUUsUUFBUSxXQUFXLEVBQUU7QUFDckUsWUFBSSxPQUFPO0FBQ1gsWUFBSSxHQUFHLFFBQVEsT0FBTSxRQUFRLENBQUU7QUFDL0IsWUFBSSxHQUFHLE9BQU8sTUFBTTtBQUNsQixjQUFJLFFBQVEsTUFBTTtBQUNoQixrQkFBTSxPQUFPLEtBQUssUUFBUSxTQUFTLEdBQUcsSUFBSSxZQUFZO0FBQ3RELGtCQUFNLE9BQU8sS0FBSyxVQUFVLEtBQUssTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ3JELGdCQUFJLENBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxHQUFHLGFBQWEsTUFBTSxNQUFNLE1BQU0sTUFBTTtBQUNsRSxpQkFBRyxVQUFVLFNBQVMsRUFBQyxXQUFXLEtBQUksQ0FBQztBQUN2QyxpQkFBRyxjQUFjLE1BQU0sSUFBSTtBQUFBLFlBQzdCO0FBQUEsVUFDRjtBQUNBLGNBQUksSUFBSSxJQUFJO0FBQUEsUUFDZCxDQUFDO0FBQUEsTUFDSCxDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU0sV0FBVztBQUFBLEVBQ2Y7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVEsRUFBQyxPQUFPLEVBQUMsU0FBUyxDQUFDLHdCQUF3QixjQUFjLEVBQUMsRUFBQztBQUFBLEVBQ25FLFNBQVMsQ0FBQyxRQUFRLEdBQUcsYUFBYSxFQUFDLFNBQVMsU0FBUyxJQUFJLE9BQUssU0FBUyxDQUFDLEtBQUssRUFBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQzVGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
