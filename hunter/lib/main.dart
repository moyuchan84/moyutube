import 'package:flutter/material.dart';

import 'app_state.dart';
import 'theme.dart';
import 'screens/discover_screen.dart';
import 'screens/insight_screen.dart';
import 'screens/keyword_screen.dart';
import 'screens/settings_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await app.init();
  runApp(const HunterApp());
}

class HunterApp extends StatelessWidget {
  const HunterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hooklit',
      debugShowCheckedModeBanner: false,
      theme: buildTheme(Brightness.light),
      darkTheme: buildTheme(Brightness.dark),
      themeMode: ThemeMode.system,
      home: const Home(),
    );
  }
}

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: app,
      builder: (context, _) {
        return Scaffold(
          body: SafeArea(
            child: IndexedStack(
              index: app.tabIndex,
              children: const [
                DiscoverScreen(),
                KeywordScreen(),
                InsightScreen(),
                SettingsScreen(),
              ],
            ),
          ),
          bottomNavigationBar: NavigationBar(
            selectedIndex: app.tabIndex,
            onDestinationSelected: app.goTab,
            destinations: const [
              NavigationDestination(icon: Icon(Icons.local_fire_department_outlined), selectedIcon: Icon(Icons.local_fire_department), label: '발굴'),
              NavigationDestination(icon: Icon(Icons.manage_search), label: '키워드'),
              NavigationDestination(icon: Icon(Icons.insights_outlined), selectedIcon: Icon(Icons.insights), label: '전략'),
              NavigationDestination(icon: Icon(Icons.settings_outlined), selectedIcon: Icon(Icons.settings), label: '설정'),
            ],
          ),
        );
      },
    );
  }
}
