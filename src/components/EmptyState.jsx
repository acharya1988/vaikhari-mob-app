import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GradientText from './GradientText';

export default function EmptyState({ title = 'Nothing here yet', subtitle = 'Try exploring or creating new content.' }) {
  return (
    <View style={s.wrap}>
      <GradientText preset="purpleBright" style={s.title}>{title}</GradientText>
      <Text style={s.sub}>{subtitle}</Text>
    </View>
  );
}

const s = StyleSheet.create({ wrap: { alignItems: 'center', padding: 24 }, title: { fontSize: 20, fontWeight: '700' }, sub: { color: '#666', marginTop: 8 } });

