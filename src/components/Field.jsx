import React from 'react';
import { TextInput, View, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing } from '../theme';

export default function Field({ label, placeholder, value, onChangeText, secureTextEntry, style, ...rest }) {
  return (
    <View style={style}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={s.input}
        placeholderTextColor={'#AAA'}
        {...rest}
      />
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 12, color: colors.grey, marginBottom: 6 },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: radii[0],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    color: colors.black,
  },
});

