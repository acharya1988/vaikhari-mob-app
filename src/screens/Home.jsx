import React from 'react';
import Screen from '../layouts/Screen';
import Button from '../components/Button';
import { View, Text } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function Home({ navigation }) {
  const { token } = useAuthStore();
  return (
    <Screen header={{ title: 'Home' }}>
      <View style={{ gap: 12 }}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 22 }}>Welcome to Vaikhari</Text>
        <Text style={{ color: '#555' }}>Sign in to access your library, messages, and more.</Text>
        {!token ? (
          <>
            <Button variant="solid" title="Sign In" onPress={() => navigation.navigate('SignIn')} />
            <Button variant="outline" title="Create Account" onPress={() => navigation.navigate('SignUp')} />
          </>
        ) : (
          <Button variant="solid" title="Go to App" onPress={() => navigation.replace('Main')} />
        )}
      </View>
    </Screen>
  );
}

