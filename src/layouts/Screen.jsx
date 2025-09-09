import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import Header from '../components/Header';

export default function Screen({ children, style, header }) {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={s.safe}>
      <StatusBar barStyle="dark-content" />
      {header ? (
        <Header title={header.title} right={header.right} left={header.left} />
      ) : null}
      <View style={[s.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, paddingHorizontal: spacing[3], paddingTop: spacing[2] },
});

