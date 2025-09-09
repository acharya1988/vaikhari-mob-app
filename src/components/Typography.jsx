import React from 'react';
import { Text } from 'react-native';
import { typography, colors } from '../theme';

export default function Typography({ variant = 'body', color = 'black', style, children, ...rest }) {
  const base = typography[variant] || typography.body;
  const colorVal = colors[color] || color || colors.black;
  return (
    <Text style={[base, { color: colorVal }, style]} {...rest}>
      {children}
    </Text>
  );
}

