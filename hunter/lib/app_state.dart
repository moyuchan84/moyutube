import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'models.dart';

final app = AppState();

/// 앱 전체 상태. 개인용이라 단순한 싱글톤으로 둔다.
class AppState extends ChangeNotifier {
  late SharedPreferences _p;

  String ytKey = '';
  String claudeKey = '';
  String model = 'claude-sonnet-5-5';
  String region = 'KR';
  String lang = 'ko';
  String channelContext = '';
  int quotaUsed = 0;
  List<InsightRecord> history = [];

  // 화면 간 공유 상태
  int tabIndex = 0;
  String? pendingKeyword;
  List<VideoItem> videos = [];
  String videosLabel = '';
  int formatFilter = 0; // 0 전체, 1 롱폼, 2 쇼츠

  Future<void> init() async {
    _p = await SharedPreferences.getInstance();
    // 설정 탭에 직접 넣은 키가 우선, 없으면 빌드할 때 --dart-define으로 넣은 기본 키(.env의 YOUTUBE_API_KEY).
    const defaultYt = String.fromEnvironment('YOUTUBE_API_KEY');
    final savedYt = _p.getString('ytKey');
    ytKey = (savedYt == null || savedYt.isEmpty) ? defaultYt : savedYt;
    claudeKey = _p.getString('claudeKey') ?? '';
    model = _p.getString('model') ?? model;
    region = _p.getString('region') ?? region;
    lang = _p.getString('lang') ?? lang;
    channelContext = _p.getString('channelContext') ?? '';
    final today = _today();
    if (_p.getString('quotaDate') == today) {
      quotaUsed = _p.getInt('quotaUsed') ?? 0;
    }
    final h = _p.getString('history');
    if (h != null) {
      try {
        history = (jsonDecode(h) as List)
            .map((e) => InsightRecord.fromJson(e as Map<String, dynamic>))
            .toList();
      } catch (_) {}
    }
  }

  String _today() {
    // 유튜브 쿼터는 태평양시 자정 리셋이라 대략 한국시간 오후 4~5시. 여기서는 단순히 날짜로 추정.
    final n = DateTime.now().toUtc().subtract(const Duration(hours: 8));
    return '${n.year}-${n.month}-${n.day}';
  }

  Future<void> addQuota(int cost) async {
    final today = _today();
    if (_p.getString('quotaDate') != today) quotaUsed = 0;
    quotaUsed += cost;
    await _p.setString('quotaDate', today);
    await _p.setInt('quotaUsed', quotaUsed);
    notifyListeners();
  }

  Future<void> saveSettings({
    required String yt,
    required String claude,
    required String mdl,
    required String reg,
    required String lng,
    required String ctx,
  }) async {
    ytKey = yt.trim();
    claudeKey = claude.trim();
    model = mdl.trim().isEmpty ? 'claude-sonnet-5-5' : mdl.trim();
    region = reg.trim().toUpperCase().isEmpty ? 'KR' : reg.trim().toUpperCase();
    lang = lng.trim().isEmpty ? 'ko' : lng.trim();
    channelContext = ctx.trim();
    await _p.setString('ytKey', ytKey);
    await _p.setString('claudeKey', claudeKey);
    await _p.setString('model', model);
    await _p.setString('region', region);
    await _p.setString('lang', lang);
    await _p.setString('channelContext', channelContext);
    notifyListeners();
  }

  void setVideos(List<VideoItem> v, String label) {
    videos = v;
    videosLabel = label;
    notifyListeners();
  }

  void setFormat(int f) {
    formatFilter = f;
    notifyListeners();
  }

  void goTab(int i) {
    tabIndex = i;
    notifyListeners();
  }

  void useKeyword(String k) {
    pendingKeyword = k;
    tabIndex = 0;
    notifyListeners();
  }

  /// 형식 필터를 적용하고 배율 높은 순으로 정렬한 목록.
  List<VideoItem> get visible {
    final l = videos.where((v) {
      if (formatFilter == 1) return !v.isShort;
      if (formatFilter == 2) return v.isShort;
      return true;
    }).toList();
    l.sort((a, b) => (b.score ?? -1).compareTo(a.score ?? -1));
    return l;
  }

  Future<void> addHistory(InsightRecord r) async {
    history.insert(0, r);
    if (history.length > 30) history = history.sublist(0, 30);
    await _p.setString(
        'history', jsonEncode(history.map((e) => e.toJson()).toList()));
    notifyListeners();
  }

  Future<void> deleteHistory(int i) async {
    history.removeAt(i);
    await _p.setString(
        'history', jsonEncode(history.map((e) => e.toJson()).toList()));
    notifyListeners();
  }
}
