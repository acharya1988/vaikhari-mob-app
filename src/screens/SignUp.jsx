import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import Field from '../components/Field';
import Button from '../components/Button';
import { View, Text } from 'react-native';
import { reserveHandle, createUserProfile, completeProfile, upsertUser, getMe } from '../actions/authAction';
import { useAuthStore } from '../store/authStore';
import { createUserWithEmailPassword } from '../auth/firebase';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState('Scholar');
  const [loading, setLoading] = useState(false);
  const { token, setToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onCreate = async () => {
    if (!name || !handle) {
      alert('Enter name and handle');
      return;
    }
    setLoading(true);
    try {
      let idToken = token;
      if (!idToken) {
        if (!email || !password) throw new Error('Enter email and password');
        const auth = await createUserWithEmailPassword(email.trim(), password);
        idToken = auth.idToken;
        await setToken(idToken);
        await upsertUser({ uid: auth.uid, email: auth.email, providerIds: auth.providerIds, idToken });
        await getMe({ idToken });
      }

      const rh = await reserveHandle({ handle, idToken });
      if (!rh.status) throw new Error(rh.response?.message || 'Handle not available');

      const cp = await createUserProfile({ profile: { name }, idToken });
      if (!cp.status) throw new Error('Failed to create profile');

      const fin = await completeProfile({ name, handle, role, idToken });
      if (!fin.status) throw new Error('Failed to complete profile');

      navigation.replace('Main');
    } catch (e) {
      console.log(e);
      alert(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen header={{ title: 'Create Account' }}>
      <View style={{ gap: 12 }}>
        {!token ? (
          <>
            <Field label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Field label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
          </>
        ) : null}
        <Field label="Full Name" placeholder="Acharya Vaidya" value={name} onChangeText={setName} />
        <Field label="Handle" placeholder="acharya" value={handle} onChangeText={setHandle} autoCapitalize="none" />
        <Field label="Role" placeholder="Scholar | Student | Practitioner" value={role} onChangeText={setRole} />
        <Button variant="solid" title={loading ? 'Creating…' : 'Create Account'} onPress={onCreate} disabled={loading} />
        <View style={{ alignItems: 'center' }}>
          <Text onPress={() => navigation.navigate('SignIn')} style={{ color: '#4A4A4A' }}>Have an account? Sign in</Text>
        </View>
      </View>
    </Screen>
  );
}
