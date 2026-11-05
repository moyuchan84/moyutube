import 'package:flutter/material.dart';

import '../app_state.dart';
import '../services/apis.dart';

class KeywordScreen extends StatefulWidget {
  const KeywordScreen({super.key});

  @override
  State<KeywordScreen> createState() => _KeywordScreenState();
}

class _KeywordScreenState extends State<KeywordScreen> {
  final _seed = TextEditingController();
  final _api = SuggestApi();
  List<String> _results = [];
  bool _loading = false;
  String? _error;

  Future<void> _go() async {
    final s = _seed.text.trim();
    if (s.isEmpty) return;
    FocusScope.of(context).unfocus();
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final r = await _api.expand(s);
      setState(() => _results = r);
      if (r.isEmpty) _error = '자동완성 결과가 없습니다. 다른 단어로 시도해 보세요.';
    } catch (e) {
      _error = '$e';
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
        child: Row(children: [
          Expanded(
            child: TextField(
              controller: _seed,
              textInputAction: TextInputAction.search,
              onSubmitted: (_) => _go(),
              decoration: const InputDecoration(
                hintText: '씨앗 단어 (예: 다이어트)',
                prefixIcon: Icon(Icons.manage_search),
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
          ),
          const SizedBox(width: 8),
          FilledButton(onPressed: _loading ? null : _go, child: const Text('확장')),
        ]),
      ),
      Padding(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 4),
        child: Align(
          alignment: Alignment.centerLeft,
          child: Text(
            '유튜브 검색창에 사람들이 실제로 치는 검색어입니다 (쿼터 소모 없음).\n'
            '탭하면 발굴 탭에서 그 키워드로 떡상 영상을 찾습니다.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ),
      ),
      if (_loading) const LinearProgressIndicator(),
      if (_error != null)
        Padding(
          padding: const EdgeInsets.all(16),
          child: Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
        ),
      Expanded(
        child: ListView.separated(
          itemCount: _results.length,
          separatorBuilder: (_, __) => const Divider(height: 1),
          itemBuilder: (_, i) => ListTile(
            dense: true,
            title: Text(_results[i]),
            trailing: const Icon(Icons.local_fire_department_outlined, size: 18),
            onTap: () => app.useKeyword(_results[i]),
          ),
        ),
      ),
    ]);
  }
}
