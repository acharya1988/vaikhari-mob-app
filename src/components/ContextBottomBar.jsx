import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode } from '../theme/ThemeProvider';

export default function ContextBottomBar({ items = [], value, onChange, onFab }) {
  const insets = useSafeAreaInsets();
  const { colors, mode } = useThemeMode();
  const split = Math.ceil(items.length / 2);
  const left = items.slice(0, split);
  const right = items.slice(split);
  const dim = mode === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(17,17,17,0.6)';
  return (
    <View style={[s.wrap, { bottom: insets.bottom + 8 }]} pointerEvents="box-none">
      <View style={[s.bar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={s.row}>
          {left.map((it) => (
            <Pressable key={it.key} onPress={() => onChange && onChange(it.key)} style={s.item}>
              <FA name={it.icon} size={18} color={value === it.key ? colors.text : dim} />
            </Pressable>
          ))}
        </View>
        <View style={s.centerGap}>
          {onFab ? (
            <Pressable style={[s.fabInline, { backgroundColor: colors.text }]} onPress={onFab} accessibilityLabel="Compose">
              <FA name="plus" size={20} color={colors.card} />
            </Pressable>
          ) : null}
        </View>
        <View style={s.row}>
          {right.map((it) => (
            <Pressable key={it.key} onPress={() => onChange && onChange(it.key)} style={s.item}>
              <FA name={it.icon} size={18} color={value === it.key ? colors.text : dim} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 12, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  item: { paddingHorizontal: 14, paddingVertical: 6 },
  centerGap: { width: 64, alignItems: 'center' },
  fabInline: { height: 44, width: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
