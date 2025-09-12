import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../layouts/Screen';
import GradientText from '../components/GradientText';
import Button from '../components/Button';
import Card from '../components/Card';
import useOrientation from '../responsive/useOrientation';
import Grid from '../responsive/Grid';
import { highlights, circlesFeed } from '../mock/feed';

export default function HomeGlowFeed({ navigation }) {
  const { orientation, isTablet } = useOrientation();
  const twoCol = isTablet || orientation === 'landscape';

  const Highlight = ({ item }) => (
    <Card title={item.title} subtitle={item.blurb} onPress={() => navigation.navigate('ContinueReading')} />
  );

  const CircleCard = ({ item }) => (
    <Card title={item.title} subtitle={`${item.circle} · ${item.blurb}`} onPress={() => navigation.navigate('Circle')} />
  );

  return (
    <Screen header={{ title: 'Vaikhari' }}>
      <View style={s.header}>
        <GradientText preset="purpleOrange" style={s.h1}>Namaste, Acharyaji</GradientText>
      </View>

      <View style={[s.actions, twoCol && s.row]}>
        <Button variant="gradient" gradientPreset="purpleOrange" title="Compose"
          onPress={() => navigation.navigate('Compose')} />
        <Button variant="outline" title="Drift"
          onPress={() => navigation.navigate('Drifts')} />
        <Button variant="ghost" title="Chintana"
          onPress={() => navigation.navigate('Chintana')} />
      </View>

      {twoCol ? (
        <Grid>
          <Card title="Today’s Highlights" subtitle="Handpicked for you">
            {highlights.map((h) => <Highlight key={h.id} item={h} />)}
          </Card>
          <Card title="From Your Circles" subtitle="New posts & debates">
            {circlesFeed.map((c) => <CircleCard key={c.id} item={c} />)}
          </Card>
          <Card title="Continue Reading" subtitle="Resume where you left off →"
            onPress={() => navigation.navigate('ContinueReading')} />
        </Grid>
      ) : (
        <>
          <Card title="Today’s Highlights" subtitle="Handpicked for you">
            {highlights.map((h) => <Highlight key={h.id} item={h} />)}
          </Card>
          <Card title="From Your Circles" subtitle="New posts & debates">
            {circlesFeed.map((c) => <CircleCard key={c.id} item={c} />)}
          </Card>
          <Card title="Continue Reading" subtitle="Resume where you left off →"
            onPress={() => navigation.navigate('ContinueReading')} />
        </>
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  header: { paddingVertical: 16 },
  h1: { fontSize: 28 },
  actions: { marginBottom: 16, gap: 12 },
  row: { flexDirection: 'row' },
});

