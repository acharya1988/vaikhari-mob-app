import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeMode } from '../theme/ThemeProvider';
import { useCopilotStore } from '../store/copilotStore';

export default function CopilotQuickActions({ visible, onClose, anchor = { top: 8, right: 8 } }) {
  const { colors } = useThemeMode();
  const { doSummarize, doTranslate, doCite, setOpen } = useCopilotStore();

  if (!visible) return null;

  const Action = ({ label, onPress, style }) => (
    <Pressable onPress={() => { onPress(); setOpen(true); onClose?.(); }} style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      <Text style={{ color: colors.text }}>{label}</Text>
    </Pressable>
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={[styles.wrap, { top: anchor.top, right: anchor.right }]}>
        {/* Simple radial layout */}
        <Action label="Translate" onPress={doTranslate} style={{ transform: [{ translateX: -60 }] }} />
        <Action label="Summarize" onPress={doSummarize} style={{ transform: [{ translateX: -40 }, { translateY: 40 }] }} />
        <Action label="Cite" onPress={doCite} style={{ transform: [{ translateY: 60 }] }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', width: 0, height: 0, zIndex: 1100 },
  item: { position: 'absolute', borderWidth: StyleSheet.hairlineWidth, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
});

