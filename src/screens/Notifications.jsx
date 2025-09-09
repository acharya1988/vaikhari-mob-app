import React from 'react';
import Screen from '../layouts/Screen';
import Card from '../components/Card';

export default function Notifications({ navigation }) {
  const notifs = [
    { id: 'n1', title: 'New reply in Ayurveda Circle', subtitle: 'Tap to open' },
    { id: 'n2', title: 'Continue reading Aṣṭāṅga Hṛdaya', subtitle: 'Pick up where you left off' },
  ];
  return (
    <Screen header={{ title: 'Notifications' }}>
      {notifs.map((n) => (
        <Card key={n.id} title={n.title} subtitle={n.subtitle} onPress={() => navigation.navigate('HomeGlowFeed')} />
      ))}
    </Screen>
  );
}

