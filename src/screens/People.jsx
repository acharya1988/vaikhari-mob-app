import React from 'react';
import Screen from '../layouts/Screen';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import { View, Text } from 'react-native';
import { people } from '../mock/people';

export default function People() {
  return (
    <Screen header={{ title: 'People' }}>
      {people.map((p) => (
        <Card key={p.id}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar name={p.name} />
            <View>
              <Text style={{ fontWeight: '700' }}>{p.name}</Text>
              <Text style={{ color: '#666' }}>{p.role}</Text>
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

