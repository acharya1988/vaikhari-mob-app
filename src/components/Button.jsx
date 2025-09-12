import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing } from '../theme';
import { gradients } from '../theme/gradients';

export default function Button({
  title,
  onPress,
  variant = 'solid', // solid | outline | ghost | gradient
  size = 'md', // sm | md | lg
  gradientPreset = 'purpleBright',
  disabled,
  left,
  right,
  style,
  textStyle,
}) {
  const padY = size === 'lg' ? 14 : size === 'sm' ? 8 : 12;
  const font = size === 'lg' ? 17 : size === 'sm' ? 14 : 16;

  const content = (
    <View style={[s.row, { gap: 8, justifyContent: 'center', alignItems: 'center' }]}>
      {left}
      <Text style={[{ fontSize: font, fontFamily: 'Poppins_600SemiBold' }, textColor(variant), textStyle]}>{title}</Text>
      {right}
    </View>
  );

  if (variant === 'gradient') {
    const stops = gradients[gradientPreset] || gradients.purpleBright;
    return (
      <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [style, { opacity: pressed ? 0.9 : 1 }] }>
        <LinearGradient colors={stops} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.base, { paddingVertical: padY, borderRadius: radii[2], paddingHorizontal: spacing[4] }]}>
          <View accessibilityRole="button">{content}</View>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [
      s.base,
      { paddingVertical: padY, borderRadius: radii[2], paddingHorizontal: spacing[4] },
      variant === 'solid' && { backgroundColor: colors.black },
      variant === 'outline' && { borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' },
      variant === 'ghost' && { backgroundColor: 'transparent' },
      disabled && { opacity: 0.5 },
      pressed && { transform: [{ scale: 0.98 }] },
      style,
    ]}>
      {content}
    </Pressable>
  );
}

const textColor = (variant) => (
  variant === 'solid' ? { color: colors.white } : { color: colors.black }
);

const s = StyleSheet.create({
  base: { alignItems: 'center' },
  row: { flexDirection: 'row' },
});
