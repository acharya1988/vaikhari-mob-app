import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, View, StyleSheet } from 'react-native';
import { colors as baseColors, spacing } from '../theme';
import Header from '../components/Header';
import AppHeader from '../components/AppHeader';
import { useThemeMode } from '../theme/ThemeProvider';

export default function Screen({ children, style, header, appHeader = true }) {
  const { colors } = useThemeMode();
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[s.safe, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.bg === '#121212' ? 'light-content' : 'dark-content'} />
      {appHeader ? (
        <AppHeader />
      ) : header ? (
        <Header title={header.title} right={header.right} left={header.left} />
      ) : null}
      <View style={[s.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: baseColors.white },
  content: { flex: 1, paddingHorizontal: spacing[3], paddingTop: spacing[2] },
});
