import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Screen from '../layouts/Screen';
import GradientText from '../components/GradientText';
import Button from '../components/Button';

export default function Onboarding({ navigation }) {
  return (
    <Screen>
      <View style={s.center}>
        <Image source={{ uri: 'https://placehold.co/200x200' }} style={s.logo} />
        <GradientText preset="purpleOrange" style={s.h1}>Vaikhari</GradientText>
        <Button variant="gradient" gradientPreset="purpleOrange" title="Get Started"
          onPress={() => navigation.replace('SignIn')} style={{ marginTop: 24 }} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, logo: { width: 120, height: 120, borderRadius: 24 }, h1: { fontSize: 32, fontWeight: '800', marginTop: 16 } });

