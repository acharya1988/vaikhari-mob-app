import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function VerticalProfileCard({
  cover = 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=60',
  avatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=60',
  name = 'Acharya Vaidya',
  subtitle = 'Scholar · Moderator',
}) {
  return (
    <View style={s.card}>
      <Image source={{ uri: cover }} style={s.cover} />
      <View style={{ alignItems: 'center', marginTop: -36 }}>
        <Image source={{ uri: avatar }} style={s.avatar} />
        <Text style={s.name}>{name}</Text>
        <Text style={s.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', marginBottom: 12 },
  cover: { width: '100%', height: 120 },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#FFF' },
  name: { marginTop: 8, fontWeight: '700', fontSize: 18 },
  subtitle: { color: '#666' },
});
