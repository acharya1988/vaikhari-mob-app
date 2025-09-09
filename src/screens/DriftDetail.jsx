import React from 'react';
import Screen from '../layouts/Screen';
import Card from '../components/Card';
import { Text } from 'react-native';

export default function DriftDetail() {
  return (
    <Screen header={{ title: 'Drift Detail' }}>
      <Card title="On Dietetics in AH" subtitle="Ayurveda · 12 comments">
        <Text style={{ color: '#333' }}>
          Detailed discussion about dietary guidelines and interpretations in Aṣṭāṅga Hṛdaya.
        </Text>
      </Card>
    </Screen>
  );
}

