import React from 'react';
import Screen from '../layouts/Screen';
import SplitPane from '../layouts/SplitPane';
import Card from '../components/Card';
import { circles } from '../mock/circles';

export default function Circle({ navigation }) {
  const left = (
    <>
      {circles.map((c) => (
        <Card key={c.id} title={c.name} subtitle={`${c.members} members`} onPress={() => navigation.navigate('People')} />
      ))}
    </>
  );
  const right = (
    <Card title="Members" subtitle="Select a circle to view people" />
  );
  return (
    <Screen header={{ title: 'Circle' }}>
      <SplitPane left={left} right={right} />
    </Screen>
  );
}
