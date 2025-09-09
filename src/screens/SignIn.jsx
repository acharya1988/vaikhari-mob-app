import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import Field from '../components/Field';
import Button from '../components/Button';
import { View } from 'react-native';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Screen header={{ title: 'Sign In' }}>
      <View style={{ gap: 12 }}>
        <Field label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Field label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
        <Button variant="solid" title="Continue" onPress={() => navigation.replace('RootTabs')} />
        <Button variant="ghost" title="Use MFA" onPress={() => navigation.navigate('MFA')} />
      </View>
    </Screen>
  );
}

