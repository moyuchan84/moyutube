import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show SystemUiOverlayStyle;

/// Sunlap(photoframe)의 "classic" 스킨과 같은 토큰: 따뜻한 종이 바탕 + 깊은 소나무색.
/// 밝게/어둡게는 휴대폰 설정을 따른다.
class _Tokens {
  const _Tokens({
    required this.brightness,
    required this.bg,
    required this.surface,
    required this.surfaceAlt,
    required this.fg,
    required this.fgMuted,
    required this.accent,
    required this.accent2,
    required this.onAccent,
    required this.border,
    required this.shadowColor,
  });

  final Brightness brightness;
  final Color bg, surface, surfaceAlt, fg, fgMuted, accent, accent2, onAccent, border, shadowColor;
}

const _light = _Tokens(
  brightness: Brightness.light,
  bg: Color(0xFFFAF7F2),
  surface: Color(0xFFFFFFFF),
  surfaceAlt: Color(0xFFF2EDE6),
  fg: Color(0xFF1F1B16),
  fgMuted: Color(0xFF6B6259),
  accent: Color(0xFF2F6660),
  accent2: Color(0xFFB0874A),
  onAccent: Colors.white,
  border: Color(0xFFE6DFD5),
  shadowColor: Color(0x14000000),
);

const _dark = _Tokens(
  brightness: Brightness.dark,
  bg: Color(0xFF141210),
  surface: Color(0xFF1E1B18),
  surfaceAlt: Color(0xFF26221F),
  fg: Color(0xFFF2EDE6),
  fgMuted: Color(0xFFA89F95),
  accent: Color(0xFF8CCFC2),
  accent2: Color(0xFFD9B77E),
  onAccent: Color(0xFF0F1F1D),
  border: Color(0xFF2E2A26),
  shadowColor: Color(0x66000000),
);

/// 배율 배지 등에 쓰는 보조 색 (Sunlap 일치율 색과 동일).
class AppColors {
  static const matchLow = Color(0xFFF2555A);
  static const matchMid = Color(0xFFF7B544);
  static const matchOk = Color(0xFF3DD68C);
}

ThemeData buildTheme(Brightness b) {
  final t = b == Brightness.dark ? _dark : _light;
  final dark = b == Brightness.dark;
  final tint = Color.alphaBlend(t.accent.withValues(alpha: dark ? 0.28 : 0.18), t.surface);
  final scheme = ColorScheme.fromSeed(seedColor: t.accent, brightness: b).copyWith(
    primary: t.accent,
    onPrimary: t.onAccent,
    primaryContainer: tint,
    onPrimaryContainer: t.fg,
    secondary: t.accent2,
    secondaryContainer: tint,
    onSecondaryContainer: t.fg,
    error: AppColors.matchLow,
    surface: t.surface,
    onSurface: t.fg,
    onSurfaceVariant: t.fgMuted,
    surfaceContainerLowest: t.surface,
    surfaceContainerLow: t.surface,
    surfaceContainer: t.surfaceAlt,
    surfaceContainerHigh: t.surfaceAlt,
    surfaceContainerHighest: t.surfaceAlt,
    outline: t.border,
    outlineVariant: t.border,
  );
  const r = 16.0;
  final side = BorderSide(color: t.border);
  final btnRadius = BorderRadius.circular(r);
  final base = Typography.material2021(platform: TargetPlatform.android);
  final text = (dark ? base.white : base.black).apply(bodyColor: t.fg, displayColor: t.fg);
  return ThemeData(
    useMaterial3: true,
    brightness: b,
    colorScheme: scheme,
    scaffoldBackgroundColor: t.bg,
    canvasColor: t.surface,
    textTheme: text.copyWith(
      titleLarge: text.titleLarge?.copyWith(fontWeight: FontWeight.w700),
      titleMedium: text.titleMedium?.copyWith(fontWeight: FontWeight.w600),
      headlineSmall: text.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: t.bg,
      foregroundColor: t.fg,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      systemOverlayStyle: dark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
    ),
    cardTheme: CardThemeData(
      color: t.surface,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(r), side: side),
      clipBehavior: Clip.antiAlias,
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(48, 52),
        backgroundColor: t.accent,
        foregroundColor: t.onAccent,
        shape: RoundedRectangleBorder(borderRadius: btnRadius),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(48, 48),
        foregroundColor: t.fg,
        side: side,
        shape: RoundedRectangleBorder(borderRadius: btnRadius),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(foregroundColor: dark ? t.accent : t.fg),
    ),
    chipTheme: ChipThemeData(
      shape: const StadiumBorder(),
      side: side,
      backgroundColor: t.surfaceAlt,
      selectedColor: tint,
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: t.surface,
      indicatorColor: tint,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: t.surface,
      surfaceTintColor: Colors.transparent,
      showDragHandle: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: t.surface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
    ),
    snackBarTheme: SnackBarThemeData(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(borderRadius: btnRadius),
      enabledBorder: OutlineInputBorder(borderRadius: btnRadius, borderSide: side),
    ),
    dividerTheme: DividerThemeData(color: t.border.withValues(alpha: 0.5)),
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      },
    ),
  );
}
