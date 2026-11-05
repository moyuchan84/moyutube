import 'package:flutter/material.dart';

import '../app_state.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late final _yt = TextEditingController(text: app.ytKey);
  late final _claude = TextEditingController(text: app.claudeKey);
  late final _model = TextEditingController(text: app.model);
  late final _region = TextEditingController(text: app.region);
  late final _lang = TextEditingController(text: app.lang);
  late final _ctx = TextEditingController(text: app.channelContext);
  bool _hide = true;

  Future<void> _save() async {
    await app.saveSettings(
      yt: _yt.text,
      claude: _claude.text,
      mdl: _model.text,
      reg: _region.text,
      lng: _lang.text,
      ctx: _ctx.text,
    );
    if (!mounted) return;
    FocusScope.of(context).unfocus();
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('저장했습니다')));
  }

  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('설정', style: tt.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text('키는 이 폰에만 저장되고 YouTube/Anthropic 서버로만 전송됩니다.', style: tt.bodySmall),
        const SizedBox(height: 16),
        _field(_yt, 'YouTube Data API 키', 'Google Cloud Console → API 및 서비스 → YouTube Data API v3 사용 설정 후 키 발급 (무료)', secret: true),
        _field(_claude, 'Claude API 키', 'console.anthropic.com 에서 발급 (전략 분석 시에만 사용, 유료 종량제)', secret: true),
        Align(
          alignment: Alignment.centerRight,
          child: TextButton.icon(
            onPressed: () => setState(() => _hide = !_hide),
            icon: Icon(_hide ? Icons.visibility : Icons.visibility_off, size: 18),
            label: Text(_hide ? '키 보기' : '키 숨기기'),
          ),
        ),
        _field(_model, 'Claude 모델', '기본값: claude-sonnet-5-5'),
        Row(children: [
          Expanded(child: _field(_region, '국가 코드', 'KR, US, JP …')),
          const SizedBox(width: 12),
          Expanded(child: _field(_lang, '언어 코드', 'ko, en, ja …')),
        ]),
        _field(
          _ctx,
          '내 채널 정보 (Claude가 참고)',
          '예) 주제: 직장인 재테크 / 현재 구독자 230명 / 목표: 3개월 1000명 / 편집: 모바일 캡컷, 주 2회 가능 / 얼굴 공개 안 함',
          lines: 5,
        ),
        const SizedBox(height: 8),
        FilledButton(onPressed: _save, child: const Text('저장')),
        const SizedBox(height: 24),
        Text('오늘 쿼터 사용 추정: ${app.quotaUsed} / 10,000 유닛', style: tt.bodySmall),
        Text('키워드 검색 1회 ≈ 102유닛 (하루 약 90회) · 급상승 ≈ 2유닛', style: tt.bodySmall),
      ],
    );
  }

  Widget _field(TextEditingController c, String label, String hint,
      {bool secret = false, int lines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: c,
        obscureText: secret && _hide,
        maxLines: secret ? 1 : lines,
        minLines: secret ? 1 : lines,
        autocorrect: false,
        decoration: InputDecoration(
          labelText: label,
          helperText: hint,
          helperMaxLines: 3,
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }
}
