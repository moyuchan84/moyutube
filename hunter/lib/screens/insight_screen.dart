import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../app_state.dart';
import '../models.dart';
import '../services/apis.dart';

const _system = '''당신은 유튜브 채널 성장 전략가입니다. 사용자는 구독자·조회수가 잘 안 나오는 개인 크리에이터이고, 짧은 기간에 유입을 늘릴 방법을 찾고 있습니다.
규칙:
- 반드시 제공된 실제 데이터(제목·통계·태그·썸네일)에 근거해서 말하세요. 근거 없는 일반론은 피합니다.
- 각 주장 끝에 [데이터]로 확인된 것인지, [추정]인지 표시하세요. 편집 컷 속도·자막 스타일처럼 데이터로 알 수 없는 것은 반드시 [추정]으로 표시합니다.
- "구독자 대비 배율"이 높은 영상은 채널 파워가 아니라 주제·제목·썸네일이 먹혀서 터진 영상일 가능성이 큽니다. 이런 영상에 가중치를 두세요.
- 한국어로, 군더더기 없이, 오늘 바로 실행할 수 있는 수준으로 쓰세요.''';

class InsightScreen extends StatefulWidget {
  const InsightScreen({super.key});

  @override
  State<InsightScreen> createState() => _InsightScreenState();
}

class _InsightScreenState extends State<InsightScreen> {
  final _claude = ClaudeApi();
  bool _withImages = true;
  bool _loading = false;
  String? _error;
  String? _result;
  String _resultBasis = '';

  List<VideoItem> get _top => app.visible.take(15).toList();

  String _buildPrompt(List<VideoItem> top, StatsSummary stats, {bool images = false}) {
    final b = StringBuffer();
    b.writeln('## 내 채널 정보');
    b.writeln(app.channelContext.isEmpty
        ? '(미입력 — 일반적인 소규모 채널로 가정)'
        : app.channelContext);
    b.writeln('\n## 수집 조건\n${app.videosLabel} / 형식 필터: ${['전체', '롱폼', '쇼츠'][app.formatFilter]}');
    b.writeln('\n## 로컬 통계 (상위 ${top.length}개 영상)\n${stats.asText()}');
    b.writeln('\n## 영상 목록 (구독자 대비 배율 높은 순)');
    for (var i = 0; i < top.length; i++) {
      final v = top[i];
      b.writeln('${i + 1}. "${v.title}" | 채널 ${v.channelTitle} (구독 ${v.subs ?? '비공개'}) | '
          '조회 ${v.views} | 배율 ${v.score?.toStringAsFixed(1) ?? '-'} | 길이 ${v.durationLabel} | '
          '${v.ageDays}일 전 | 좋아요율 ${v.likeRate.toStringAsFixed(1)}% | 댓글 ${v.comments} | '
          '태그: ${v.tags.take(6).join(', ')}');
    }
    if (images) {
      b.writeln('\n(첨부된 이미지는 위 목록 1번부터 순서대로의 썸네일입니다.)');
    }
    b.writeln('''

## 요청
아래 순서의 마크다운 섹션으로 답하세요.
0. **내가 시작할 주제 후보 3개** — 사용자는 어떤 주제를 해야 할지 아직 감이 없을 수 있습니다. 내 채널 정보(없으면 데이터만)와 이 데이터를 바탕으로, 경쟁이 덜하면서 수요가 보이는 주제 3개를 이유와 함께 추천하고 그중 1개를 1순위로 고르세요.
1. **지금 먹히는 주제 패턴** — 반복되는 주제·소재·앵글 3~5개
2. **제목 공식** — 실제 제목에서 뽑은 공식 3~5개와 각각의 빈칸 채우기 템플릿
3. **길이·형식 권장** — 롱폼/쇼츠, 적정 길이, 업로드 요일·시간대
4. **썸네일 스타일** — 색, 글자 크기·문구 길이, 얼굴/표정, 구도의 공통점 (이미지가 있으면 이미지를 근거로)
5. **편집 스타일 가이드** — 첫 5초 훅, 컷 호흡, 자막, 효과음·BGM 등 (데이터로 알 수 없는 부분은 [추정] 표시)
6. **바로 만들 영상 아이디어 10개** — 각각: 제목안 / 첫 5초 훅 대사 / 왜 먹힐지(어느 영상 패턴에서 왔는지)
7. **피해야 할 것** — 이 데이터에서 보이는 함정
7일 실행 계획 — 하루 단위 체크리스트로 마무리''');
    return b.toString();
  }

  Future<void> _generate() async {
    final top = _top;
    if (top.length < 5) {
      setState(() => _error = '먼저 발굴 탭에서 영상을 5개 이상 모으세요.');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final stats = StatsSummary.from(top);
      final images = _withImages
          ? top.take(8).map((e) => e.thumb).where((u) => u.isNotEmpty).toList()
          : <String>[];
      // 이미지를 쓰면 번호 대응이 어긋나지 않도록 앞 8개 썸네일만 순서대로 보낸다.
      final text = _buildPrompt(top, stats, images: images.isNotEmpty);
      final r = await _claude.ask(system: _system, text: text, imageUrls: images);
      final basis = '${app.videosLabel} · 상위 ${top.length}개';
      await app.addHistory(InsightRecord(DateTime.now(), basis, r));
      setState(() {
        _result = r;
        _resultBasis = basis;
      });
    } catch (e) {
      setState(() => _error = '$e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: app,
      builder: (context, _) {
        final top = _top;
        final stats = StatsSummary.from(top);
        final tt = Theme.of(context).textTheme;
        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('전략 인사이트', style: tt.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(
              top.isEmpty
                  ? '발굴 탭에서 내 분야 키워드로 영상을 먼저 모으세요.'
                  : '기준: ${app.videosLabel} 상위 ${top.length}개',
              style: tt.bodySmall,
            ),
            if (stats.lines.isNotEmpty) ...[
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(children: [
                    for (final l in stats.lines)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 3),
                        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          SizedBox(width: 130, child: Text(l.key, style: tt.bodySmall)),
                          Expanded(child: Text(l.value, style: const TextStyle(fontWeight: FontWeight.w600))),
                        ]),
                      ),
                  ]),
                ),
              ),
            ],
            const SizedBox(height: 8),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('썸네일 이미지도 분석'),
              subtitle: const Text('상위 8개 썸네일을 Claude에 보냅니다 (비용 조금 ↑)'),
              value: _withImages,
              onChanged: (v) => setState(() => _withImages = v),
            ),
            FilledButton.icon(
              onPressed: _loading || top.isEmpty ? null : _generate,
              icon: _loading
                  ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Icon(Icons.auto_awesome),
              label: Text(_loading ? 'Claude가 분석 중… (30초~1분)' : 'Claude로 전략 만들기'),
            ),
            OutlinedButton.icon(
              onPressed: top.isEmpty
                  ? null
                  : () {
                      Clipboard.setData(ClipboardData(
                          text: '$_system\n\n${_buildPrompt(top, stats)}'));
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                          content: Text('프롬프트를 복사했습니다. Claude 앱/웹에 붙여넣으세요 (API 키 불필요)')));
                    },
              icon: const Icon(Icons.copy_all),
              label: const Text('프롬프트 복사 (API 키 없이 Claude 앱에 붙여넣기)'),
            ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
              ),
            if (_result != null) ...[
              const SizedBox(height: 16),
              _ResultCard(title: '방금 분석 · $_resultBasis', text: _result!, initiallyOpen: true),
            ],
            if (app.history.isNotEmpty) ...[
              const SizedBox(height: 20),
              Text('지난 분석', style: tt.titleMedium),
              for (var i = 0; i < app.history.length; i++)
                _ResultCard(
                  title: '${_fmtDate(app.history[i].at)} · ${app.history[i].basis}',
                  text: app.history[i].text,
                  onDelete: () => app.deleteHistory(i),
                ),
            ],
          ],
        );
      },
    );
  }

  String _fmtDate(DateTime d) =>
      '${d.month}/${d.day} ${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
}

class _ResultCard extends StatelessWidget {
  final String title;
  final String text;
  final bool initiallyOpen;
  final VoidCallback? onDelete;
  const _ResultCard({required this.title, required this.text, this.initiallyOpen = false, this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ExpansionTile(
        initiallyExpanded: initiallyOpen,
        title: Text(title, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14)),
        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        children: [
          SelectableText(text, style: const TextStyle(height: 1.5)),
          const SizedBox(height: 8),
          Row(children: [
            TextButton.icon(
              onPressed: () {
                Clipboard.setData(ClipboardData(text: text));
                ScaffoldMessenger.of(context)
                    .showSnackBar(const SnackBar(content: Text('복사했습니다')));
              },
              icon: const Icon(Icons.copy, size: 18),
              label: const Text('복사'),
            ),
            if (onDelete != null)
              TextButton.icon(
                onPressed: onDelete,
                icon: const Icon(Icons.delete_outline, size: 18),
                label: const Text('삭제'),
              ),
          ]),
        ],
      ),
    );
  }
}
