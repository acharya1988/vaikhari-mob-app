// Minimal wrapper to show placeholder usage; keeping app-level Toast as-is
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <View style={s.wrap}>
      <Text style={s.text}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 40, left: 20, right: 20, padding: 12, backgroundColor: 'black', borderRadius: 12 },
  text: { color: 'white', textAlign: 'center' },
});

