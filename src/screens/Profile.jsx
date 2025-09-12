import React from 'react';
import Screen from '../layouts/Screen';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import VerticalProfileCard from '../components/VerticalProfileCard';
import { View, Text } from 'react-native';

export default function Profile({ navigation }) {
  return (
    <Screen header={{ title: 'Profile' }}>
      <VerticalProfileCard />
      <Card title="Your Circles" subtitle="Manage your groups" onPress={() => navigation.navigate('Circle')} />
      <Card title="People" subtitle="Peers and mentors" onPress={() => navigation.navigate('People')} />
      <Card title="Settings" subtitle="Preferences and privacy" onPress={() => navigation.navigate('Settings')} />
    </Screen>
  );
}
