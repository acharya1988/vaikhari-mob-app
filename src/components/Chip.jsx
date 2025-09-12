import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';

export default function Chip({ label, selected, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[s.base, selected ? s.sel : s.unsel, style]}>
      <Text style={[s.text, selected && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    borderRadius: radii[0],
    paddingHorizontal: spacing[3],
    paddingVertical: 8,
    borderWidth: 1,
  },
  sel: { backgroundColor: colors.black, borderColor: colors.black },
  unsel: { backgroundColor: 'transparent', borderColor: 'rgba(0,0,0,0.12)' },
  text: { fontSize: 13, color: colors.black, fontWeight: '600' },
});

