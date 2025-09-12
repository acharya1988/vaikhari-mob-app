import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { colors, radii } from '../theme';

export default function IconButton({ icon, onPress, style, size = 40, variant = 'ghost' }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      s.base,
      variant === 'ghost' && { backgroundColor: 'transparent' },
      variant === 'soft' && { backgroundColor: 'rgba(0,0,0,0.04)' },
      { width: size, height: size, borderRadius: radii[0], alignItems: 'center', justifyContent: 'center' },
      pressed && { opacity: 0.8 },
      style,
    ]}>
      <View>{icon}</View>
    </Pressable>
  );
}

const s = StyleSheet.create({ base: { borderColor: colors.grey } });

