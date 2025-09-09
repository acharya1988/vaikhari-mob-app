import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';

export default function Tabs({ options = [], value, onChange }) {
  const [internal, setInternal] = useState(value ?? options?.[0]?.value);
  const selected = value ?? internal;
  const handle = (v) => {
    setInternal(v);
    onChange && onChange(v);
  };
  return (
    <View style={s.wrap}>
      {options.map((opt) => (
        <Pressable key={opt.value} onPress={() => handle(opt.value)} style={[s.item, selected === opt.value && s.sel]}>
          <Text style={[s.text, selected === opt.value && { color: colors.white }]}>{opt.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 8, backgroundColor: '#F4F4F4', padding: 6, borderRadius: radii[0] },
  item: { paddingHorizontal: spacing[3], paddingVertical: 8, borderRadius: radii[0] },
  sel: { backgroundColor: colors.black },
  text: { fontSize: 13, color: colors.black, fontWeight: '600' },
});

