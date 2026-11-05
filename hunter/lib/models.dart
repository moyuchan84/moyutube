import 'dart:math';

class VideoItem {
  final String id;
  final String title;
  final String channelId;
  final String channelTitle;
  final DateTime publishedAt;
  final String thumb;
  final int views;
  final int likes;
  final int comments;
  final int durationSec;
  final List<String> tags;
  int? subs;

  VideoItem({
    required this.id,
    required this.title,
    required this.channelId,
    required this.channelTitle,
    required this.publishedAt,
    required this.thumb,
    required this.views,
    required this.likes,
    required this.comments,
    required this.durationSec,
    required this.tags,
    this.subs,
  });

  /// 구독자 대비 조회수 배율. 구독자 비공개면 null.
  double? get score => subs == null ? null : views / max(subs!, 100);

  bool get isShort => durationSec <= 180;

  int get ageDays => max(1, DateTime.now().difference(publishedAt).inDays);

  double get likeRate => views == 0 ? 0 : likes / views * 100;

  String get url => 'https://www.youtube.com/watch?v=$id';

  String get durationLabel {
    final h = durationSec ~/ 3600;
    final m = (durationSec % 3600) ~/ 60;
    final s = durationSec % 60;
    String two(int v) => v.toString().padLeft(2, '0');
    return h > 0 ? '$h:${two(m)}:${two(s)}' : '$m:${two(s)}';
  }

  static int parseDuration(String iso) {
    final m = RegExp(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?').firstMatch(iso);
    if (m == null) return 0;
    int g(int i) => int.tryParse(m.group(i) ?? '') ?? 0;
    return g(1) * 3600 + g(2) * 60 + g(3);
  }

  factory VideoItem.fromApi(Map<String, dynamic> j) {
    final sn = (j['snippet'] ?? {}) as Map<String, dynamic>;
    final st = (j['statistics'] ?? {}) as Map<String, dynamic>;
    final cd = (j['contentDetails'] ?? {}) as Map<String, dynamic>;
    final th = (sn['thumbnails'] ?? {}) as Map<String, dynamic>;
    String thumb = '';
    for (final k in ['maxres', 'standard', 'high', 'medium', 'default']) {
      if (th[k] != null) {
        thumb = th[k]['url'] as String;
        break;
      }
    }
    return VideoItem(
      id: j['id'] as String,
      title: (sn['title'] ?? '') as String,
      channelId: (sn['channelId'] ?? '') as String,
      channelTitle: (sn['channelTitle'] ?? '') as String,
      publishedAt:
          DateTime.tryParse((sn['publishedAt'] ?? '') as String)?.toLocal() ??
              DateTime.now(),
      thumb: thumb,
      views: int.tryParse('${st['viewCount'] ?? 0}') ?? 0,
      likes: int.tryParse('${st['likeCount'] ?? 0}') ?? 0,
      comments: int.tryParse('${st['commentCount'] ?? 0}') ?? 0,
      durationSec: parseDuration((cd['duration'] ?? '') as String),
      tags: ((sn['tags'] ?? []) as List).map((e) => '$e').toList(),
    );
  }
}

/// 유튜브 카테고리 (한국 기준 자주 쓰는 것). id → 이름
const videoCategories = <String, String>{
  '20': '게임',
  '27': '교육',
  '26': '노하우/스타일',
  '28': '과학기술',
  '22': '인물/블로그',
  '24': '엔터',
  '23': '코미디',
  '19': '여행',
  '17': '스포츠',
  '10': '음악',
  '15': '동물',
  '2': '자동차',
  '1': '영화/애니',
  '25': '뉴스/정치',
};

/// 결과 영상들의 제목·태그에서 여러 영상에 걸쳐 반복되는 단어를 뽑는다. (키워드를 모를 때 힌트용)
List<String> hotWords(List<VideoItem> videos, {int max = 12, String exclude = ''}) {
  final stop = {
    '영상', '진짜', '이거', '그냥', '하는', '있는', '하면', '이유', '방법', '결과', '최신',
    'the', 'and', 'for', 'with', 'you', 'this', 'that', 'shorts', 'short', 'video', 'official',
  };
  final ex = exclude.toLowerCase().split(RegExp(r'\s+')).where((e) => e.isNotEmpty).toSet();
  final count = <String, int>{};
  for (final v in videos) {
    final seen = <String>{};
    final text = '${v.title} ${v.tags.take(10).join(' ')}'.toLowerCase();
    for (final w in text.replaceAll(RegExp(r'[^\w\s가-힣]'), ' ').split(RegExp(r'\s+'))) {
      if (w.length < 2 || stop.contains(w) || ex.contains(w) || RegExp(r'^\d+$').hasMatch(w)) continue;
      seen.add(w);
    }
    for (final w in seen) {
      count[w] = (count[w] ?? 0) + 1;
    }
  }
  final min = videos.length >= 20 ? 3 : 2;
  final list = count.entries.where((e) => e.value >= min).toList()
    ..sort((a, b) => b.value.compareTo(a.value));
  return list.take(max).map((e) => e.key).toList();
}

String fmtNum(num n) {
  if (n >= 100000000) return '${(n / 100000000).toStringAsFixed(1)}억';
  if (n >= 10000) return '${(n / 10000).toStringAsFixed(n >= 100000 ? 0 : 1)}만';
  if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}천';
  return '$n';
}

class InsightRecord {
  final DateTime at;
  final String basis;
  final String text;
  InsightRecord(this.at, this.basis, this.text);

  Map<String, dynamic> toJson() =>
      {'at': at.toIso8601String(), 'basis': basis, 'text': text};

  factory InsightRecord.fromJson(Map<String, dynamic> j) => InsightRecord(
        DateTime.parse(j['at'] as String),
        j['basis'] as String,
        j['text'] as String,
      );
}

/// 폰 안에서 바로 계산하는 통계 (Claude 호출 없음).
class StatsSummary {
  final List<MapEntry<String, String>> lines;
  StatsSummary(this.lines);

  static double _median(List<num> v) {
    if (v.isEmpty) return 0;
    final s = [...v]..sort();
    final mid = s.length ~/ 2;
    return s.length.isOdd ? s[mid].toDouble() : (s[mid - 1] + s[mid]) / 2;
  }

  static String _dur(double sec) {
    final m = sec ~/ 60;
    final s = (sec % 60).round();
    return '$m분 $s초';
  }

  factory StatsSummary.from(List<VideoItem> v) {
    if (v.isEmpty) return StatsSummary([]);
    final n = v.length;
    int pct(bool Function(VideoItem) f) =>
        (v.where(f).length / n * 100).round();

    final scores = v.map((e) => e.score).whereType<double>().toList();
    final words = <String, int>{};
    final stop = {'the', 'and', 'of', 'to', 'in', 'a', 'for', 'on', 'is', '-', '|'};
    for (final e in v) {
      for (final w in e.title
          .toLowerCase()
          .replaceAll(RegExp(r'[^\w\s가-힣]'), ' ')
          .split(RegExp(r'\s+'))) {
        if (w.length < 2 || stop.contains(w)) continue;
        words[w] = (words[w] ?? 0) + 1;
      }
    }
    final topWords = (words.entries.where((e) => e.value >= 2).toList()
          ..sort((a, b) => b.value.compareTo(a.value)))
        .take(8)
        .map((e) => '${e.key}(${e.value})')
        .join(', ');

    final tagCount = <String, int>{};
    for (final e in v) {
      for (final t in e.tags) {
        final k = t.toLowerCase();
        tagCount[k] = (tagCount[k] ?? 0) + 1;
      }
    }
    final topTags = (tagCount.entries.where((e) => e.value >= 2).toList()
          ..sort((a, b) => b.value.compareTo(a.value)))
        .take(10)
        .map((e) => '${e.key}(${e.value})')
        .join(', ');

    const wd = ['월', '화', '수', '목', '금', '토', '일'];
    final dayCount = List.filled(7, 0);
    final hourCount = List.filled(24, 0);
    for (final e in v) {
      dayCount[e.publishedAt.weekday - 1]++;
      hourCount[e.publishedAt.hour]++;
    }
    final topDay = dayCount.indexOf(dayCount.reduce(max));
    final topHour = hourCount.indexOf(hourCount.reduce(max));

    return StatsSummary([
      MapEntry('분석 영상 수', '$n개'),
      if (scores.isNotEmpty)
        MapEntry('구독자 대비 조회수 중앙값', '×${_median(scores).toStringAsFixed(1)}'),
      MapEntry('중앙 영상 길이', _dur(_median(v.map((e) => e.durationSec).toList()))),
      MapEntry('쇼츠(3분 이하) 비율', '${pct((e) => e.isShort)}%'),
      MapEntry('제목 평균 길이', '${(v.map((e) => e.title.length).reduce((a, b) => a + b) / n).round()}자'),
      MapEntry('제목에 숫자 포함', '${pct((e) => RegExp(r'\d').hasMatch(e.title))}%'),
      MapEntry('제목이 질문형(?)', '${pct((e) => e.title.contains('?'))}%'),
      MapEntry('제목에 괄호/대괄호', '${pct((e) => RegExp(r'[\[\(【]').hasMatch(e.title))}%'),
      MapEntry('평균 좋아요율', '${(v.map((e) => e.likeRate).reduce((a, b) => a + b) / n).toStringAsFixed(1)}%'),
      MapEntry('업로드 많은 요일/시간', '${wd[topDay]}요일 · ${topHour}시대'),
      if (topWords.isNotEmpty) MapEntry('제목 자주 나온 단어', topWords),
      if (topTags.isNotEmpty) MapEntry('자주 쓰인 태그', topTags),
    ]);
  }

  String asText() => lines.map((e) => '- ${e.key}: ${e.value}').join('\n');
}
