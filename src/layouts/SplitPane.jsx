import React from 'react';
import { View, StyleSheet } from 'react-native';
import useOrientation from '../responsive/useOrientation';

// If isTablet or landscape -> render left and right side-by-side, else render just left
export default function SplitPane({ left, right, minLeft = 320, gap = 16 }) {
  const { orientation, isTablet } = useOrientation();
  const twoPane = isTablet || orientation === 'landscape';
  if (!twoPane) return <View style={s.single}>{left}</View>;
  return (
    <View style={[s.row, { gap }]}> 
      <View style={[s.left, { minWidth: minLeft }]}>{left}</View>
      <View style={s.right}>{right}</View>
    </View>
  );
}

const s = StyleSheet.create({
  single: { flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
  left: { flex: 1 },
  right: { flex: 2 },
});

