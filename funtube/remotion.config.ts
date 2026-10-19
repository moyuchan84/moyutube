import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
// 3D(Three.js) 장면 렌더용 — ride3d
Config.setChromiumOpenGlRenderer("angle");
