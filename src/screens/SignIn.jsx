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
  const extra = Constants?.expoConfig?.extra || {};
  const webClientId = getGoogleWebClientId();
  const isExpoGo = Constants?.appOwnership === 'expo';
  const redirectUri =    AuthSession.makeRedirectUri({ scheme: 'vaikhari', path: 'oauth2redirect' });

  console.log("redirectUri",redirectUri)

  // isExpoGo
  //   ? AuthSession.makeRedirectUri({ useProxy: true })

  // console.log("extraa",extra)
  // console.log("webClientId",webClientId)

  const clientConfig = 
    // ? { expoClientId: "378458540928-daicttk15pe6i81jthr8d8vq6roitqoc.apps.googleusercontent.com" }
    // :
     {
        androidClientId: "378458540928-daicttk15pe6i81jthr8d8vq6roitqoc.apps.googleusercontent.com",
     }//   iosClientId: extra.GOOGLE_IOS_CLIENT_ID || undefined,
      // };

      console.log("clientConfig",clientConfig)


  // const [request, response, promptAsync] = Google.useAuthRequest({
 
  //   androidClientId: "378458540928-lbnbjbb6roitqoc.apps.googleusercontent.com",

  //   scopes: ['profile', 'email'],
  //   responseType: 'id_token',
  //   selectAccount: true,
  //   redirectUri,
  // });

    // IMPORTANT: provide BOTH expoClientId and androidClientId
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "378458540928-lbnbjbb6roitqoc.apps.googleusercontent.com",
    androidClientId: "378458540928-lbnbjbb6roitqoc.apps.googleusercontent.com",
    webClientId: "378458540928-lbnbjbb6roitqoc.apps.googleusercontent.com",

    // expoClientId: "YOUR_EXPO_GO_CLIENT_ID.apps.googleusercontent.com",     // for Expo Go
    // androidClientId: "YOUR_ANDROID_OAUTH_CLIENT_ID.apps.googleusercontent.com", // for dev client / APK
    // webClientId: "YOUR_WEB_OAUTH_CLIENT_ID.apps.googleusercontent.com",    // helps issue Firebase-verifiable id_token
    // Do NOT pass redirectUri unless you have a special case; the hook infers it.
    responseType: "id_token",
    scopes: ["profile", "email"],
    selectAccount: true,
  });
  console.log("request",request)
  console.log("response",response)

  useEffect(() => {
    const run = async () => {
      if (response?.type === 'success') {
        const googleIdToken = response.params?.id_token;
        if (!googleIdToken) return;
        setLoading(true);
        try {
          const auth = await signInWithGoogleIdToken(googleIdToken);
          const { idToken, uid, email, providerIds } = auth;
          await setToken(idToken);
          const upRes = await upsertUser({ uid, email, providerIds, idToken });
          if (!upRes.status) throw new Error('Failed to upsert user');
          const meRes = await getMe({ idToken });
          if (!meRes.status) throw new Error('Failed to fetch profile');
          navigation.replace('Main');
        } catch (e) {
          alert(e.message || 'Google sign-in failed');
        } finally {
          setLoading(false);
        }
      }
    };
    run();
  }, [response]);

  const onContinue = async () => {
    setLoading(true);
    try {
      const auth = await signInWithEmailPassword(email.trim(), password);
      const { idToken, uid, providerIds } = auth;
      await setToken(idToken);
      const upRes = await upsertUser({ uid, email, providerIds, idToken });
      if (!upRes.status) throw new Error('Failed to upsert user');
      const meRes = await getMe({ idToken });
      if (!meRes.status) throw new Error('Failed to fetch profile');
      navigation.replace('Main');
    } catch (e) {
      console.log(e);
      alert(e.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
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
          onPress={() => promptAsync({ useProxy: isExpoGo })}
          disabled={!request || loading}
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
