import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import { TextInput, View, StyleSheet } from 'react-native';
import Button from '../components/Button';

export default function Compose({ navigation }) {
  const [text, setText] = useState('');
  return (
    <Screen header={{ title: 'Compose' }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Share your thoughts..."
        multiline
        style={s.input}
      />
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <Button variant="gradient" gradientPreset="purpleBright" title="Post" onPress={() => navigation.goBack()} />
        <Button variant="ghost" title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({ input: { minHeight: 160, backgroundColor: '#F7F7F7', padding: 12, borderRadius: 12, textAlignVertical: 'top' } });

