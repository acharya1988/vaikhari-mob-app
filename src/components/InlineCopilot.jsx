import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useThemeMode } from '../theme/ThemeProvider';
import { useCopilotStore } from '../store/copilotStore';

export default function InlineCopilot({ compact = false, label = 'Ask Copilot' }) {
  const { colors } = useThemeMode();
  const { setOpen } = useCopilotStore();
  const accent = { base: '#F2E0CF', primary: '#854628' };
  return (
    <Pressable onPress={() => setOpen(true)} style={[styles.btn, { backgroundColor: compact ? colors.card : accent.base, borderColor: colors.border }]}> 
      <View style={[styles.dot, { backgroundColor: accent.primary }]} />
      <Text style={{ color: compact ? colors.text : accent.primary, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
});

