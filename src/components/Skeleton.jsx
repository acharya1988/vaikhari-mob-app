import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Skeleton({ width = '100%', height = 16, radius = 8, style }) {
  return <View style={[s.skel, { width, height, borderRadius: radius }, style]} />;
}

const s = StyleSheet.create({
  skel: { backgroundColor: 'rgba(0,0,0,0.06)' },
});

