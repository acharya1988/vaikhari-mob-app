import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Avatar({ uri, name = '', size = 40, style }) {
  if (uri) {
    return <Image source={{ uri }} style={[{ width: size, height: size, borderRadius: size / 2 }, style]} />;
  }
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View style={[s.base, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={{ color: '#FFF', fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}

const s = StyleSheet.create({ base: { backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' } });

