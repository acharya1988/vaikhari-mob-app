import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, View, StyleSheet } from 'react-native';

export default function SidePanel({ visible, onClose, side = 'right', width = Math.min(360, Dimensions.get('window').width * 0.9), children }) {
  const trans = useRef(new Animated.Value(0)).current; // 0 hidden, 1 shown

  useEffect(() => {
    Animated.timing(trans, { toValue: visible ? 1 : 0, duration: 250, useNativeDriver: true }).start();
  }, [visible]);

  const translateX = trans.interpolate({
    inputRange: [0, 1],
    outputRange: side === 'right' ? [width, 0] : [-width, 0],
  });

  if (!visible && trans.__getValue() === 0) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={s.backdrop} onPress={onClose} />
      <Animated.View style={[s.panel, { width, [side]: 0, transform: [{ translateX }] }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  panel: { position: 'absolute', top: 0, bottom: 0, backgroundColor: '#FFF', elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, padding: 16 },
});

