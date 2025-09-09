import React from 'react';
import Screen from '../layouts/Screen';
import Card from '../components/Card';

export default function Chintana({ navigation }) {
  const threads = [
    { id: 't1', title: 'Metre in ślokas', subtitle: 'Prosody and rhythm' },
    { id: 't2', title: 'Semantic layers', subtitle: 'Multiple readings' },
  ];
  return (
    <Screen header={{ title: 'Chintana' }}>
      {threads.map((t) => (
        <Card key={t.id} title={t.title} subtitle={t.subtitle} onPress={() => navigation.navigate('Compose')} />
      ))}
    </Screen>
  );
}

