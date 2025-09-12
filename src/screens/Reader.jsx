import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../components/Button';
import useOrientation from '../responsive/useOrientation';

export default function Reader() {
  const [size, setSize] = useState(18);
  const { orientation, isTablet } = useOrientation();
  const twoCol = isTablet || orientation === 'landscape';
  const paragraph =
    'योगः कर्मसु कौशलम्। Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.';

  const TextBlock = () => (
    <Text style={[s.text, { fontSize: size }]}> {paragraph + '\n\n' + paragraph + '\n\n' + paragraph} </Text>
  );

  return (
    <Screen header={{ title: 'Reader', right: <View style={{ flexDirection: 'row', gap: 8 }}><Button title="Aa" variant="outline" onPress={() => setSize((v) => Math.min(28, v + 2))} /><Button title="⤒" variant="ghost" /></View> }}>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {twoCol ? (
          <>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll}><TextBlock /></ScrollView>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll}><TextBlock /></ScrollView>
          </>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll}><TextBlock /></ScrollView>
        )}
      </View>
      <View style={s.bar}>
        <Button variant="ghost" title="Layer" />
        <Button variant="ghost" title="Drift" />
        <Button variant="ghost" title="Note" />
        <Button variant="ghost" title="Share" />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  text: { lineHeight: 28 },
  scroll: { paddingBottom: 80 },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', padding: 8, flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
});

