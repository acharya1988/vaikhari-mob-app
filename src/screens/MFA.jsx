import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import Field from '../components/Field';
import Button from '../components/Button';
import { View } from 'react-native';

export default function MFA({ navigation }) {
  const [code, setCode] = useState('');
  return (
    <Screen header={{ title: 'Two-Factor' }}>
      <View style={{ gap: 12 }}>
        <Field label="Code" placeholder="123456" value={code} onChangeText={setCode} keyboardType="number-pad" />
        <Button variant="solid" title="Verify" onPress={() => navigation.replace('Main')} />
      </View>
    </Screen>
  );
}
