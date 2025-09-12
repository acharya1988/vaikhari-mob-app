import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import Field from '../components/Field';
import Card from '../components/Card';

export default function Search({ navigation }) {
  const [q, setQ] = useState('');
  return (
    <Screen header={{ title: 'Search' }}>
      <Field placeholder="Search books, drifts, people" value={q} onChangeText={setQ} style={{ marginBottom: 12 }} />
      <Card title="Aṣṭāṅga Hṛdaya" subtitle="Book" onPress={() => navigation.navigate('BookProfile')} />
      <Card title="On Dietetics in AH" subtitle="Drift" onPress={() => navigation.navigate('DriftDetail')} />
      <Card title="Acharya Vaidya" subtitle="Person" onPress={() => navigation.navigate('People')} />
    </Screen>
  );
}

