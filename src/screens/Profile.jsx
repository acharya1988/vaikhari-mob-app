import React from 'react';
import Screen from '../layouts/Screen';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import { View, Text } from 'react-native';

export default function Profile({ navigation }) {
  return (
    <Screen header={{ title: 'Profile' }}>
      <Card>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Avatar name="Acharya Vaidya" size={72} />
          <Text style={{ fontWeight: '700', fontSize: 18 }}>Acharya Vaidya</Text>
          <Text style={{ color: '#666' }}>Scholar · Moderator</Text>
        </View>
      </Card>
      <Card title="Your Circles" subtitle="Manage your groups" onPress={() => navigation.navigate('Circle')} />
      <Card title="People" subtitle="Peers and mentors" onPress={() => navigation.navigate('People')} />
      <Card title="Settings" subtitle="Preferences and privacy" onPress={() => navigation.navigate('Settings')} />
    </Screen>
  );
}

