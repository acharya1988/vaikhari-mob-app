import React from 'react';
import Screen from '../layouts/Screen';
import SplitPane from '../layouts/SplitPane';
import Grid from '../responsive/Grid';
import Card from '../components/Card';
import { Image, View, Text, StyleSheet } from 'react-native';
import { books } from '../mock/library';

export default function Library({ navigation }) {
  const left = (
    <Grid>
      {books.map((b) => (
        <Card key={b.id} onPress={() => navigation.navigate('BookProfile')} style={{ padding: 12 }}>
          <Image source={{ uri: b.cover }} style={s.cover} />
          <View style={{ marginTop: 8 }}>
            <Text numberOfLines={1} style={s.title}>{b.title}</Text>
            <Text numberOfLines={1} style={s.sub}>{b.author}</Text>
          </View>
        </Card>
      ))}
    </Grid>
  );
  const right = (
    <Card title="Library Preview" subtitle="Select a book to see details" />
  );
  return (
    <Screen header={{ title: 'Library' }}>
      <SplitPane left={left} right={right} />
    </Screen>
  );
}

const s = StyleSheet.create({
  cover: { width: '100%', aspectRatio: 3/4, borderRadius: 12, backgroundColor: '#EEE' },
  title: { fontWeight: '700' },
  sub: { color: '#666', marginTop: 2, fontSize: 12 },
});
