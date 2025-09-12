import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import SplitPane from '../layouts/SplitPane';
import Chip from '../components/Chip';
import Card from '../components/Card';
import { View, StyleSheet } from 'react-native';
import { drifts as DRIFTS } from '../mock/drifts';

export default function Drifts({ navigation }) {
  const [tag, setTag] = useState('All');
  const tags = ['All', 'Ayurveda', 'Sanskrit', 'Tech'];
  const list = DRIFTS.filter((d) => tag === 'All' || d.tag === tag);
  const left = (
    <>
      <View style={s.chips}>
        {tags.map((t) => <Chip key={t} label={t} selected={tag === t} onPress={() => setTag(t)} />)}
      </View>
      {list.map((d) => (
        <Card key={d.id} title={d.title} subtitle={`${d.tag} · ${d.comments} comments`} onPress={() => navigation.navigate('DriftDetail')} />
      ))}
    </>
  );
  const right = (
    <Card title="Drift Preview" subtitle="Select a drift to see details" />
  );
  return (
    <Screen header={{ title: 'Drifts' }}>
      <SplitPane left={left} right={right} />
    </Screen>
  );
}

const s = StyleSheet.create({ chips: { flexDirection: 'row', gap: 8, marginBottom: 12 } });
