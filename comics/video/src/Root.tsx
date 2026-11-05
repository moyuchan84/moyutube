import { Composition } from "remotion";
import { ComicView } from "./ComicView";
import { comicFrames } from "./comic";
import { ep01 } from "./episodes/ep01.comic";

// 만화책 페이지 판 (ComicView). 예전 전체 화면 판(Episode.tsx · episodes/ep01.ts)은 기록으로만 둔다.
const eps = { ep01 };

export const Root = () => (
  <>
    {Object.entries(eps).map(([id, comic]) => (
      <Composition key={id} id={id} component={ComicView} defaultProps={{ comic }} durationInFrames={comicFrames(comic)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
