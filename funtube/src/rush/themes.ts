import love from "../../content/rush/love.json";
import drive1 from "../../content/rush/drive1.json";
import drive2 from "../../content/rush/drive2.json";
import military from "../../content/rush/military.json";
import { buildRush } from "./timeline";
import type { Theme } from "./types";

// content/rush/<id>.json 을 만들면 여기에 한 줄 추가한다 → Root 가 `rush-<id>` 컴포지션으로 등록
export const THEMES: Theme[] = [military as unknown as Theme, love as unknown as Theme, drive1 as unknown as Theme, drive2 as unknown as Theme];
export const durationOf = (t: Theme) => buildRush(t).durationInFrames;
