import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, hairline, radii, spacing } from '../theme';
import { FontAwesome5 as FA } from '@expo/vector-icons';

export default function Card({ title, subtitle, onPress, right, children, style }) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={({ pressed }) => [
      s.card,
      pressed && onPress && { transform: [{ scale: 0.995 }], opacity: 0.95 },
      style,
    ]}>
      {(title || subtitle) && (
        <View style={s.header}>
          {title && <Text style={s.title}>{title}</Text>}
          {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children}
      <View style={s.right}>
        {right || (onPress ? <FA name="chevron-right" size={16} color={'#000'} /> : null)}
      </View>
    </Wrapper>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii[2],
    padding: spacing[3],
    marginBottom: spacing[3],
    ...hairline(0.08),
  },
  header: { marginBottom: 6 },
  title: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: colors.black },
  subtitle: { fontSize: 13, color: colors.grey, marginTop: 2 },
  right: { position: 'absolute', right: 12, top: 12 },
});
