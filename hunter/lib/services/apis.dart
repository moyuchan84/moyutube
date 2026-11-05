import 'dart:convert';

import 'package:http/http.dart' as http;

import '../app_state.dart';
import '../models.dart';

class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  @override
  String toString() => message;
}

/// YouTube Data API v3 (무료 쿼터: 하루 10,000유닛. search=100, 나머지=1)
class YouTubeApi {
  Future<Map<String, dynamic>> _get(
      String path, Map<String, String> params, int cost) async {
    if (app.ytKey.isEmpty) {
      throw ApiException('설정 탭에서 YouTube API 키를 먼저 입력하세요.');
    }
    final uri = Uri.https(
        'www.googleapis.com', '/youtube/v3/$path', {...params, 'key': app.ytKey});
    final res = await http.get(uri).timeout(const Duration(seconds: 20));
    final body = jsonDecode(utf8.decode(res.bodyBytes)) as Map<String, dynamic>;
    if (res.statusCode != 200) {
      final msg = body['error']?['message'] ?? 'HTTP ${res.statusCode}';
      throw ApiException('YouTube API 오류: $msg');
    }
    await app.addQuota(cost);
    return body;
  }

  /// 키워드로 최근 N일 인기 영상을 찾고 구독자 대비 조회수를 붙인다. (약 102유닛)
  /// [q]가 비어 있고 [categoryId]만 있으면 키워드 없이 그 카테고리의 인기 영상을 찾는다.
  Future<List<VideoItem>> searchOutliers(String q, int days, {String? categoryId}) async {
    final after = DateTime.now()
        .toUtc()
        .subtract(Duration(days: days))
        .toIso8601String();
    final s = await _get(
        'search',
        {
          'part': 'id',
          'type': 'video',
          if (q.isNotEmpty) 'q': q,
          if (categoryId != null) 'videoCategoryId': categoryId,
          'maxResults': '50',
          'order': 'viewCount',
          'publishedAfter': after,
          'regionCode': app.region,
          'relevanceLanguage': app.lang,
        },
        100);
    final ids = ((s['items'] ?? []) as List)
        .map((e) => e['id']?['videoId'])
        .whereType<String>()
        .toList();
    return _hydrate(ids);
  }

  /// 국가별 급상승 영상 (1유닛). categoryId 비우면 전체.
  Future<List<VideoItem>> trending({String? categoryId}) async {
    final r = await _get(
        'videos',
        {
          'part': 'snippet,statistics,contentDetails',
          'chart': 'mostPopular',
          'regionCode': app.region,
          'maxResults': '50',
          if (categoryId != null) 'videoCategoryId': categoryId,
        },
        1);
    final items = ((r['items'] ?? []) as List)
        .map((e) => VideoItem.fromApi(e as Map<String, dynamic>))
        .toList();
    await _attachSubs(items);
    return items;
  }

  Future<List<VideoItem>> _hydrate(List<String> ids) async {
    if (ids.isEmpty) return [];
    final r = await _get(
        'videos',
        {
          'part': 'snippet,statistics,contentDetails',
          'id': ids.join(','),
          'maxResults': '50',
        },
        1);
    final items = ((r['items'] ?? []) as List)
        .map((e) => VideoItem.fromApi(e as Map<String, dynamic>))
        .toList();
    await _attachSubs(items);
    return items;
  }

  Future<void> _attachSubs(List<VideoItem> items) async {
    final chIds = items.map((e) => e.channelId).toSet().toList();
    final subs = <String, int?>{};
    for (var i = 0; i < chIds.length; i += 50) {
      final chunk = chIds.sublist(i, i + 50 > chIds.length ? chIds.length : i + 50);
      final r = await _get(
          'channels', {'part': 'statistics', 'id': chunk.join(','), 'maxResults': '50'}, 1);
      for (final c in (r['items'] ?? []) as List) {
        final st = c['statistics'] ?? {};
        subs[c['id'] as String] =
            st['hiddenSubscriberCount'] == true ? null : int.tryParse('${st['subscriberCount'] ?? ''}');
      }
    }
    for (final v in items) {
      v.subs = subs[v.channelId];
    }
  }
}

/// 유튜브 검색창 자동완성 (비공식, 키/쿼터 불필요)
class SuggestApi {
  Future<List<String>> suggest(String q) async {
    final uri = Uri.https('suggestqueries.google.com', '/complete/search',
        {'client': 'firefox', 'ds': 'yt', 'hl': app.lang, 'q': q});
    final res = await http.get(uri).timeout(const Duration(seconds: 10));
    if (res.statusCode != 200) return [];
    final j = jsonDecode(utf8.decode(res.bodyBytes));
    if (j is List && j.length > 1 && j[1] is List) {
      return (j[1] as List).map((e) => '$e').toList();
    }
    return [];
  }

  /// 시드 + 가나다… 로 확장해서 사람들이 실제로 치는 검색어를 넓게 모은다.
  Future<List<String>> expand(String seed) async {
    const suffix = ['', ' 가', ' 나', ' 다', ' 라', ' 마', ' 바', ' 사', ' 아', ' 자', ' 차', ' 카', ' 타', ' 파', ' 하', ' 방법', ' 추천', ' 이유'];
    final out = <String>{};
    final results = await Future.wait(suffix.map((s) => suggest('$seed$s').catchError((_) => <String>[])));
    for (final r in results) {
      out.addAll(r);
    }
    out.remove(seed);
    return out.toList();
  }
}

/// Claude Messages API (폰에서 직접 호출, 개인용)
class ClaudeApi {
  Future<String> ask({
    required String system,
    required String text,
    List<String> imageUrls = const [],
  }) async {
    if (app.claudeKey.isEmpty) {
      throw ApiException('설정 탭에서 Claude API 키를 먼저 입력하세요.');
    }
    final content = [
      for (final u in imageUrls)
        {
          'type': 'image',
          'source': {'type': 'url', 'url': u}
        },
      {'type': 'text', 'text': text},
    ];
    final res = await http
        .post(
          Uri.parse('https://api.anthropic.com/v1/messages'),
          headers: {
            'x-api-key': app.claudeKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: jsonEncode({
            'model': app.model,
            'max_tokens': 6000,
            'system': system,
            'messages': [
              {'role': 'user', 'content': content}
            ],
          }),
        )
        .timeout(const Duration(minutes: 4));
    final body = jsonDecode(utf8.decode(res.bodyBytes)) as Map<String, dynamic>;
    if (res.statusCode != 200) {
      throw ApiException('Claude API 오류: ${body['error']?['message'] ?? res.statusCode}');
    }
    return ((body['content'] ?? []) as List)
        .where((b) => b['type'] == 'text')
        .map((b) => b['text'] as String)
        .join('\n');
  }
}
