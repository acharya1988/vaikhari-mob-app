import React from 'react';
import Screen from '../layouts/Screen';
import Card from '../components/Card';
import ProgressRing from '../components/ProgressRing';
import { View, StyleSheet } from 'react-native';
import { continueReading } from '../mock/feed';

export default function ContinueReading({ navigation }) {
  return (
    <Screen header={{ title: 'Continue Reading' }}>
      {continueReading.map((item) => (
        <Card key={item.id} title={item.title} onPress={() => navigation.navigate('Reader')}
          right={<ProgressRing size={28} strokeWidth={3} progress={item.progress} />}>
          <View style={s.row} />
        </Card>
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({ row: { height: 0 } });

