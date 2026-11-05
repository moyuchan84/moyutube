import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../app_state.dart';
import '../models.dart';
import '../services/apis.dart';
import '../theme.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  final _kw = TextEditingController();
  final _api = YouTubeApi();
  int _days = 30;
  String? _cat; // 선택한 카테고리 id (키워드 없이 찾을 때)
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    app.addListener(_syncKeyword);
  }

  @override
  void dispose() {
    app.removeListener(_syncKeyword);
    _kw.dispose();
    super.dispose();
  }

  // 키워드 탭에서 넘어온 검색어를 받아서 바로 검색한다.
  void _syncKeyword() {
    final k = app.pendingKeyword;
    if (k == null) return;
    app.pendingKeyword = null;
    _kw.text = k;
    _search();
  }

  Future<void> _run(Future<List<VideoItem>> Function() f, String label) async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final r = await f();
      app.setVideos(r, label);
    } catch (e) {
      _error = '$e';
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _search() {
    final q = _kw.text.trim();
    if (q.isEmpty && _cat == null) {
      setState(() => _error = '키워드를 입력하거나, 아래에서 카테고리를 고르세요.');
      return;
    }
    final catName = _cat == null ? null : videoCategories[_cat];
    final label = [
      if (q.isNotEmpty) '"$q"',
      if (catName != null) catName,
      '최근 $_days일',
    ].join(' · ');
    final cat = _cat;
    _run(() => _api.searchOutliers(q, _days, categoryId: cat), label);
  }

  // 떠오르는 단어를 탭하면 그 단어로 바로 다시 찾는다.
  void _useWord(String w) {
    _kw.text = w;
    _search();
  }

  void _trending() =>
      _run(() => _api.trending(), '${app.region} 급상승 영상');

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: app,
      builder: (context, _) {
        final list = app.visible;
        final hot = hotWords(list, exclude: _kw.text);
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
              child: Row(children: [
                Expanded(
                  child: TextField(
                    controller: _kw,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => _search(),
                    decoration: const InputDecoration(
                      hintText: '키워드 (모르면 비워두고 아래 카테고리 선택)',
                      prefixIcon: Icon(Icons.search),
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                    onPressed: _loading ? null : _search,
                    child: const Text('찾기')),
              ]),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Wrap(spacing: 6, crossAxisAlignment: WrapCrossAlignment.center, children: [
                for (final d in [7, 30, 90])
                  ChoiceChip(
                    label: Text('$d일'),
                    selected: _days == d,
                    onSelected: (_) => setState(() => _days = d),
                  ),
                const SizedBox(width: 6),
                for (final e in {0: '전체', 1: '롱폼', 2: '쇼츠'}.entries)
                  ChoiceChip(
                    label: Text(e.value),
                    selected: app.formatFilter == e.key,
                    onSelected: (_) => app.setFormat(e.key),
                  ),
                ActionChip(
                  avatar: const Icon(Icons.trending_up, size: 16),
                  label: const Text('급상승'),
                  onPressed: _loading ? null : _trending,
                ),
              ]),
            ),
            SizedBox(
              height: 46,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                children: [
                  for (final e in videoCategories.entries)
                    Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        label: Text(e.value),
                        selected: _cat == e.key,
                        onSelected: _loading
                            ? null
                            : (sel) {
                                setState(() => _cat = sel ? e.key : null);
                                // 키워드 없이 카테고리만 고르면 바로 찾는다.
                                if (sel && _kw.text.trim().isEmpty) _search();
                              },
                      ),
                    ),
                ],
              ),
            ),
            if (hot.isNotEmpty)
              SizedBox(
                height: 44,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  children: [
                    const Padding(
                      padding: EdgeInsets.only(right: 8, top: 12),
                      child: Text('🔥 떠오르는 단어', style: TextStyle(fontSize: 12)),
                    ),
                    for (final w in hot)
                      Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ActionChip(
                          label: Text(w),
                          visualDensity: VisualDensity.compact,
                          onPressed: _loading ? null : () => _useWord(w),
                        ),
                      ),
                  ],
                ),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 4),
              child: Row(children: [
                Expanded(
                  child: Text(
                    app.videosLabel.isEmpty
                        ? '구독자 대비 조회수(배율)가 높은 순으로 보여줍니다'
                        : '${app.videosLabel} · ${list.length}개',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
                Text('오늘 쿼터 ≈ ${app.quotaUsed}/10000',
                    style: Theme.of(context).textTheme.bodySmall),
              ]),
            ),
            if (_loading) const LinearProgressIndicator(),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(_error!,
                    style: TextStyle(color: Theme.of(context).colorScheme.error)),
              ),
            Expanded(
              child: list.isEmpty && !_loading
                  ? const Center(
                      child: Padding(
                        padding: EdgeInsets.all(32),
                        child: Text(
                          '키워드를 몰라도 괜찮아요.\n'
                          '위에서 관심 있는 카테고리를 하나 고르거나\n'
                          '"급상승"을 눌러 보세요.\n\n'
                          '작은 채널인데 조회수가 높은 영상(배율 ↑)이\n'
                          '지금 먹히는 주제와 스타일의 힌트입니다.\n'
                          '결과 위에 뜨는 "떠오르는 단어"를 누르면\n'
                          '그 주제로 더 좁혀서 찾습니다.',
                          textAlign: TextAlign.center,
                        ),
                      ),
                    )
                  : ListView.builder(
                      itemCount: list.length,
                      itemBuilder: (_, i) => _VideoTile(v: list[i], rank: i + 1),
                    ),
            ),
          ],
        );
      },
    );
  }
}

class _VideoTile extends StatelessWidget {
  final VideoItem v;
  final int rank;
  const _VideoTile({required this.v, required this.rank});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final s = v.score;
    final hot = s != null && s >= 5;
    return InkWell(
      onTap: () => _showDetail(context),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Stack(children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(v.thumb,
                  width: 128,
                  height: 72,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) =>
                      Container(width: 128, height: 72, color: cs.surfaceContainerHighest)),
            ),
            Positioned(
              right: 4,
              bottom: 4,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                decoration: BoxDecoration(
                    color: Colors.black87, borderRadius: BorderRadius.circular(4)),
                child: Text(v.durationLabel,
                    style: const TextStyle(color: Colors.white, fontSize: 11)),
              ),
            ),
          ]),
          const SizedBox(width: 10),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(v.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.w600, height: 1.25)),
              const SizedBox(height: 4),
              Text(
                '${v.channelTitle} · 구독 ${v.subs == null ? '비공개' : fmtNum(v.subs!)}',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 4),
              Row(children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: hot ? AppColors.matchOk.withValues(alpha: 0.9) : cs.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(s == null ? '–' : '×${s.toStringAsFixed(1)}',
                      style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: hot ? Colors.black : cs.onSurface)),
                ),
                const SizedBox(width: 6),
                Text('${fmtNum(v.views)}회 · ${v.ageDays}일 전',
                    style: Theme.of(context).textTheme.bodySmall),
              ]),
            ]),
          ),
        ]),
      ),
    );
  }

  void _showDetail(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (_) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        maxChildSize: 0.95,
        builder: (ctx, sc) => ListView(
          controller: sc,
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
          children: [
            ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(v.thumb, fit: BoxFit.cover)),
            const SizedBox(height: 12),
            SelectableText(v.title,
                style: Theme.of(ctx).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('${v.channelTitle} · 구독 ${v.subs == null ? '비공개' : fmtNum(v.subs!)}'),
            Text('조회 ${fmtNum(v.views)} · 좋아요 ${fmtNum(v.likes)} (${v.likeRate.toStringAsFixed(1)}%) · 댓글 ${fmtNum(v.comments)}'),
            Text('길이 ${v.durationLabel} · ${v.ageDays}일 전 업로드 · 하루 평균 ${fmtNum(v.views / v.ageDays)}회'),
            if (v.score != null) Text('구독자 대비 ×${v.score!.toStringAsFixed(1)}'),
            const SizedBox(height: 12),
            if (v.tags.isNotEmpty) ...[
              const Text('태그', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Wrap(spacing: 6, runSpacing: 4, children: [
                for (final t in v.tags.take(25)) Chip(label: Text(t), visualDensity: VisualDensity.compact),
              ]),
            ],
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: () => launchUrl(Uri.parse(v.url), mode: LaunchMode.externalApplication),
              icon: const Icon(Icons.play_circle_outline),
              label: const Text('유튜브에서 보기'),
            ),
          ],
        ),
      ),
    );
  }
}
