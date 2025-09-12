import React, { useEffect, useState } from 'react';
import Screen from '../layouts/Screen';
import Field from '../components/Field';
import Button from '../components/Button';
import { View, Text } from 'react-native';
import { upsertUser, getMe } from '../actions/authAction';
import { useAuthStore } from '../store/authStore';
import { signInWithEmailPassword, signInWithGoogleIdToken } from '../auth/firebase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import { getGoogleWebClientId } from '../auth/googleConfig';

WebBrowser.maybeCompleteAuthSession();

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuthStore();

  // Runtime/env
  const extra = Constants?.expoConfig?.extra || {};
  const isExpoGo = Constants?.appOwnership === 'expo';
  const expoClientId = extra.GOOGLE_EXPO_CLIENT_ID || getGoogleWebClientId();
  const androidClientId = extra.GOOGLE_ANDROID_CLIENT_ID || undefined;
  const iosClientId = extra.GOOGLE_IOS_CLIENT_ID || undefined;

  // Useful logs for debugging setup
  console.log('Auth redirect (computed):', AuthSession.makeRedirectUri({ useProxy: isExpoGo }));
  console.log('isExpoGo:', isExpoGo);
  console.log('expoClientId:', expoClientId);

  // Configure Google Auth request
  const [request, response, promptAsync] = Google.useAuthRequest(
    isExpoGo
      ? { expoClientId, responseType: 'id_token', scopes: ['openid', 'profile', 'email'], selectAccount: true }
      : { androidClientId, iosClientId, responseType: 'id_token', scopes: ['openid', 'profile', 'email'], selectAccount: true }
  );

  useEffect(() => {
    // Bypass Google sign-in: if flow returns, just go to Activity/Main
    if (response?.type === 'success') {
      navigation.replace('Main');
    }
  }, [response]);

  const onContinue = async () => {
    // Bypass email/password auth and go straight to Activity/Main
    navigation.replace('Main');
  };

  return (
    <Screen header={{ title: 'Sign In' }}>
      <View style={{ gap: 12 }}>
        <Field label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Field label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
        <Button variant="solid" title={loading ? 'Signing in…' : 'Continue'} onPress={onContinue} disabled={loading} />
        <Button
          variant="outline"
          title="Continue with Google"
          onPress={() => navigation.replace('Main')}
          disabled={loading}
          left={<FA name="google" size={16} color="#000" />}
        />
        <Button variant="ghost" title="Use MFA" onPress={() => navigation.navigate('EnrollMFA')} />
        <View style={{ alignItems: 'center' }}>
          <Text onPress={() => navigation.navigate('SignUp')} style={{ color: '#4A4A4A' }}>New here? Create account</Text>
        </View>
      </View>
    </Screen>
  );
}
