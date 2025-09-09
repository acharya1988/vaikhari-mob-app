import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Screen from '../layouts/Screen';
import GradientText from '../components/GradientText';
import Button from '../components/Button';
import Card from '../components/Card';
import useOrientation from '../responsive/useOrientation';

export default function BookProfile({ navigation }) {
  const { orientation, isTablet } = useOrientation();
  const row = isTablet || orientation === 'landscape';

  return (
    <Screen header={{ title: 'Book' }}>
      <View style={[s.wrap, row && s.row]}>
        <Image source={{ uri: 'https://placehold.co/160x220' }} style={[s.cover, row && s.coverL]} />
        <View style={{ flex: 1 }}>
          <GradientText preset="purpleBright" style={s.title}>Aṣṭāṅga Hṛdaya</GradientText>
          <Card title="Vāgbhaṭa (Author) · Kalpatantra Vaidya Gurukula (Commentary)" />
          <Card title="4.8 (218) · Sanskrit · Devanāgarī · Vaikhari Annotated · ⏱ 8–12h · 624 pages" />
          <View style={[s.actions, row && s.actionsRight]}>
            <Button variant="gradient" gradientPreset="purpleOrange" title="READ"
              onPress={() => navigation.navigate('Reader')} />
            <Button variant="outline" title="ADD TO SHELF" />
          </View>
        </View>
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  wrap: { gap: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  cover: { width: 160, height: 220, borderRadius: 16, alignSelf: 'center' },
  coverL: { alignSelf: 'flex-start' },
  title: { fontSize: 22, marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  actionsRight: { justifyContent: 'flex-end' },
});

