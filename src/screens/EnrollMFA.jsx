import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import Field from '../components/Field';
import Button from '../components/Button';
import { View } from 'react-native';
import { enrollMfa } from '../actions/authAction';
import { useAuthStore } from '../store/authStore';

export default function EnrollMFA({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const onEnroll = async () => {
    if (!token) return alert('Sign in first');
    if (!phone) return alert('Enter phone number');
    setLoading(true);
    try {
      const res = await enrollMfa({ phone, idToken: token });
      if (!res.status) throw new Error('Failed to enroll');
      navigation.goBack();
    } catch (e) {
      alert(e.message || 'MFA enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen header={{ title: 'Two-Factor' }}>
      <View style={{ gap: 12 }}>
        <Field label="Phone" placeholder="+1 555 123 4567" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Button variant="solid" title={loading ? 'Saving…' : 'Enroll'} onPress={onEnroll} disabled={loading} />
      </View>
    </Screen>
  );
}

