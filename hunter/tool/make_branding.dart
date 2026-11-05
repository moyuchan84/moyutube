// Hooklit 앱 아이콘·스플래시 이미지를 그린다. 다시 만들 때: `dart run tool/make_branding.dart`
// Sunlap(photoframe)과 같은 팔레트·구성: 소나무색 기울기 바탕, 크림색 궤도, 황동색 중심.
// 그림: 가운데 빛나는 재생 삼각형(영상), 둘레 궤도를 돌아 맨 위로 튀어나온 점(= 떡상한 영상, 훅).
// 결과는 assets/branding/ 에 쓰고, flutter_launcher_icons·flutter_native_splash가 읽는다.

import 'dart:io';
import 'dart:math' as math;

import 'package:image/image.dart' as img;

void save(String path, img.Image image) {
  File(path)
    ..parent.createSync(recursive: true)
    ..writeAsBytesSync(img.encodePng(image));
  stdout.writeln('wrote $path');
}

typedef Rgba = (double, double, double, double);

const _pineTop = (0x3A, 0x7D, 0x74), _pineBottom = (0x1E, 0x48, 0x44);
const _creamC = (0xF6, 0xF0, 0xE4), _brassC = (0xE8, 0xC2, 0x84), _coreC = (0xF3, 0xD6, 0x9C);

(int, int, int) _bg(double x, double y) {
  final t = ((x * 0.35 + y * 0.65)).clamp(0.0, 1.0);
  int mix(int a, int b) => (a + (b - a) * t).round();
  return (
    mix(_pineTop.$1, _pineBottom.$1),
    mix(_pineTop.$2, _pineBottom.$2),
    mix(_pineTop.$3, _pineBottom.$3),
  );
}

// 삼각형 꼭짓점 (중심 기준, 무게중심이 0이 되도록). 오른쪽을 향하는 재생 모양.
const _tri = [(-0.062, -0.098), (-0.062, 0.098), (0.124, 0.0)];
const _triRound = 0.022;

double _distSeg(double px, double py, double ax, double ay, double bx, double by) {
  final vx = bx - ax, vy = by - ay;
  final t = (((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)).clamp(0.0, 1.0);
  final qx = ax + vx * t, qy = ay + vy * t;
  return math.sqrt((px - qx) * (px - qx) + (py - qy) * (py - qy));
}

double _cross(double ax, double ay, double bx, double by, double px, double py) =>
    (bx - ax) * (py - ay) - (by - ay) * (px - ax);

/// 둥근 삼각형까지의 부호 있는 거리 (안쪽이면 음수).
double _triDist(double x, double y) {
  // 꼭짓점을 무게중심 쪽으로 줄인 삼각형에서 모서리 반지름만큼 부풀린다.
  const k = 1 - 0.30;
  final v = [for (final p in _tri) (p.$1 * k, p.$2 * k)];
  var d = double.infinity;
  for (var i = 0; i < 3; i++) {
    final a = v[i], b = v[(i + 1) % 3];
    d = math.min(d, _distSeg(x, y, a.$1, a.$2, b.$1, b.$2));
  }
  final s1 = _cross(v[0].$1, v[0].$2, v[1].$1, v[1].$2, x, y);
  final s2 = _cross(v[1].$1, v[1].$2, v[2].$1, v[2].$2, x, y);
  final s3 = _cross(v[2].$1, v[2].$2, v[0].$1, v[0].$2, x, y);
  final inside = (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0);
  return (inside ? -d : d) - _triRound - 0.025;
}

Rgba? _iconArt(double x, double y) {
  Rgba c((int, int, int) c, [double a = 1]) => (c.$1 / 255, c.$2 / 255, c.$3 / 255, a);

  const cx = 0.5, cy = 0.53;
  const orbit = 0.335;
  const dotR = 0.06;
  final dx = x - cx, dy = y - cy;
  final d = math.sqrt(dx * dx + dy * dy);

  // 맨 위 점
  const sx = cx, sy = cy - orbit;
  final ds = math.sqrt((x - sx) * (x - sx) + (y - sy) * (y - sy));
  if (ds <= dotR) return c(_creamC);
  if (ds <= dotR + 0.024) return null;

  // 재생 삼각형: 안쪽은 밝은 황동색, 가장자리로 갈수록 진한 황동색
  final td = _triDist(dx, dy);
  if (td <= 0) {
    final t = math.pow((-td / 0.07).clamp(0.0, 1.0), 0.8).toDouble();
    double mix(int a, int b) => (a + (b - a) * (1 - t)) / 255;
    return (mix(_coreC.$1, _brassC.$1), mix(_coreC.$2, _brassC.$2), mix(_coreC.$3, _brassC.$3), 1);
  }

  // 궤도: 시계 방향으로 갈수록 가늘고 흐려지는 꼬리
  var theta = math.atan2(dx, -dy);
  if (theta < 0) theta += 2 * math.pi;
  final k = theta / (2 * math.pi);
  final half = 0.006 + 0.021 * math.pow(k, 1.2);
  if ((d - orbit).abs() <= half) return c(_creamC, 0.24 + 0.76 * math.pow(k, 1.5));

  // 삼각형 둘레 빛무리
  if (td <= 0.11) {
    final g = 1 - td / 0.11;
    return c(_brassC, 0.30 * g * g);
  }
  return null;
}

img.Image drawIcon(
  int size, {
  double art = 1,
  bool opaque = true,
  bool withArt = true,
  double? disc,
}) {
  const ss = 4;
  final out = img.Image(width: size, height: size, numChannels: 4);
  final off = (1 - art) / 2;
  for (var py = 0; py < size; py++) {
    for (var px = 0; px < size; px++) {
      var r = 0.0, g = 0.0, b = 0.0, a = 0.0;
      for (var sy = 0; sy < ss; sy++) {
        for (var sx = 0; sx < ss; sx++) {
          final nx = (px + (sx + 0.5) / ss) / size, ny = (py + (sy + 0.5) / ss) / size;
          if (disc != null) {
            final ddx = nx - 0.5, ddy = ny - 0.5;
            if (ddx * ddx + ddy * ddy > disc * disc / 4) continue;
          }
          final bgc = _bg(nx, ny);
          var cr = bgc.$1 / 255, cg = bgc.$2 / 255, cb = bgc.$3 / 255;
          var ca = opaque ? 1.0 : 0.0;
          final f = withArt ? _iconArt((nx - off) / art, (ny - off) / art) : null;
          if (f != null) {
            final (fr, fg, fb, fa) = f;
            if (opaque) {
              cr = cr * (1 - fa) + fr * fa;
              cg = cg * (1 - fa) + fg * fa;
              cb = cb * (1 - fa) + fb * fa;
            } else {
              cr = bgc.$1 / 255 * (1 - fa) + fr * fa;
              cg = bgc.$2 / 255 * (1 - fa) + fg * fa;
              cb = bgc.$3 / 255 * (1 - fa) + fb * fa;
              ca = 1;
            }
          }
          r += cr * ca;
          g += cg * ca;
          b += cb * ca;
          a += ca;
        }
      }
      final n = (ss * ss).toDouble();
      final alpha = a / n;
      int ch(double v) => a == 0 ? 0 : (v / a * 255).round().clamp(0, 255);
      out.setPixelRgba(px, py, ch(r), ch(g), ch(b), (alpha * 255).round());
    }
  }
  return out;
}

void main() {
  const dir = 'assets/branding';
  save('$dir/icon.png', drawIcon(1024));
  save('$dir/icon_background.png', drawIcon(1024, withArt: false));
  save('$dir/icon_foreground.png', drawIcon(1024, art: 0.62, opaque: false));
  save('$dir/splash.png', drawIcon(768, art: 0.86, disc: 0.86));
  save('$dir/splash_android12.png', drawIcon(1152, art: 0.62, disc: 0.64));
}
