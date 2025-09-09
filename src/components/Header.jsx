import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function Header({ title, right, left }) {
  return (
    <View style={s.wrap}>
      <View style={{ width: 60 }}>{left}</View>
      <Text style={s.title}>{title}</Text>
      <View style={{ width: 60, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.black },
});

