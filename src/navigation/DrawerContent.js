import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import { useThemeMode } from '../theme/ThemeProvider';

const sections = ['Connect', 'My Works', 'My Journey'];

function SectionSelector({ value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
      {sections.map((s) => (
        <Pressable key={s} onPress={() => onChange(s)} style={[st.box, value === s && st.boxActive]}>
          <Text style={[st.boxText, value === s && { color: '#FFF' }]}>{s}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function DrawerContent(props) {
  const { navigation } = props;
  const { mode, colors, cycle } = useThemeMode();
  const [section, setSection] = useState('Connect');

  const go = (route, params) => {
    navigation.closeDrawer();
    if (route) navigation.navigate(route, params);
  };

  const menu = {
    Connect: [
      { label: 'Dashboard', icon: 'home', route: 'HomeGlowFeed' },
      { label: 'Activity', icon: 'bolt', route: 'Activity' },
      { label: 'People', icon: 'user-friends', route: 'People' },
      { label: 'Organizations', icon: 'building', route: 'Circle' },
      { label: 'Circles', icon: 'users', route: 'Circle' },
      { label: 'Messages', icon: 'envelope', route: 'Notifications' },
    ],
    'My Journey': [
      { label: 'My Evolutions', icon: 'project-diagram', route: 'Chintana' },
      { label: 'My Drifts', icon: 'wind', route: 'Drifts' },
      { label: 'My Favorites', icon: 'star', route: 'Library' },
      { label: 'My Layers', icon: 'layer-group', route: 'Settings' },
      { label: 'My Notes', icon: 'sticky-note', route: 'Compose' },
    ],
    'My Works': [
      { label: 'Library', icon: 'book', route: 'Library' },
      { label: 'Manage Books', icon: 'book-open', route: 'Library' },
      { label: 'Manage Articles', icon: 'file-alt', route: 'Search' },
      { label: 'Citations', icon: 'quote-right', route: 'Search' },
      { label: 'Quotes', icon: 'bookmark', route: 'Search' },
      { label: 'Glossary', icon: 'book', route: 'Search' },
      { label: 'Living Document', icon: 'file', route: 'Search' },
      { label: 'Media', icon: 'image', route: 'Search' },
    ],
  };

  const items = menu[section];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ padding: 16, backgroundColor: colors.card }}>
      <View style={{ alignItems: 'center' }}>
        <Image source={{ uri: 'https://placehold.co/240x120' }} style={{ height: 120, width: '100%', borderRadius: 12 }} />
        <Image source={{ uri: 'https://placehold.co/96x96' }} style={{ width: 72, height: 72, borderRadius: 36, marginTop: -36, borderWidth: 2, borderColor: '#FFF' }} />
        <Text style={{ marginTop: 8, fontFamily: 'Poppins_700Bold', color: colors.text }}>Acharya Vaidya</Text>
        <Text style={{ color: '#666' }}>Scholar · Moderator</Text>
        <View style={{ flexDirection: 'row', marginTop: 6 }}>
          {[0,1,2,3,4].map((i) => <FA key={i} name="star" size={14} color="#F5B561" style={{ marginHorizontal: 2 }} />)}
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
          <Stat label="Books" value="42" />
          <Stat label="Articles" value="18" />
          <Stat label="Followers" value="2.4k" />
          <Stat label="Following" value="312" />
        </View>
        <SectionSelector value={section} onChange={setSection} />
      </View>

      <View style={{ marginTop: 16 }}>
        {items.map((it) => (
          <Pressable key={it.label} onPress={() => go(it.route)} style={st.item}>
            <FA name={it.icon} size={16} color={colors.text} style={{ width: 22 }} />
            <Text style={[st.itemLabel, { color: colors.text }]}>{it.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 24, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 12 }}>
        <Pressable onPress={cycle} style={st.footerItem}><FA name="adjust" size={16} color={colors.text} /><Text style={[st.itemLabel, { color: colors.text }]}>Theme: {mode}</Text></Pressable>
        <Pressable onPress={() => go('Settings')} style={st.footerItem}><FA name="cog" size={16} color={colors.text} /><Text style={[st.itemLabel, { color: colors.text }]}>Settings</Text></Pressable>
        <Pressable onPress={() => {}} style={st.footerItem}><FA name="sign-out-alt" size={16} color={colors.text} /><Text style={[st.itemLabel, { color: colors.text }]}>Logout</Text></Pressable>
        <Text style={{ marginTop: 8, color: '#888' }}>V.1</Text>
      </View>
    </DrawerContentScrollView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Poppins_700Bold' }}>{value}</Text>
      <Text style={{ color: '#666', fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  box: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E5E5' },
  boxActive: { backgroundColor: '#111', borderColor: '#111' },
  boxText: { fontFamily: 'Poppins_600SemiBold', color: '#111' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  itemLabel: { marginLeft: 8 },
  footerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
});
