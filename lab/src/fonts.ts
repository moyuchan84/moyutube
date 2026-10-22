// 장면을 그리기 전에 Pretendard 를 받아 둔다 (렌더도 브라우저에서 하므로 웹폰트가 그대로 쓰인다)
const CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = CSS;
document.head.appendChild(link);

const timeout = new Promise(resolve => setTimeout(resolve, 5000));
await Promise.race([
  (async () => {
    await new Promise(resolve => (link.onload = resolve));
    await Promise.all(
      ['600', '700', '800'].map(w => document.fonts.load(`${w} 64px "Pretendard Variable"`, '가나다')),
    );
  })(),
  timeout,
]);

export {};
