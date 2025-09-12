import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView, Animated, Easing } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import { useThemeMode } from '../theme/ThemeProvider';
import { useAuthStore } from '../store/authStore';
import { signOutSession } from '../actions/authAction';
import { menu as sharedMenu, sections as sharedSections } from './menu';

const sections = sharedSections;
const sectionIcons = { 'Connect': 'link', 'My Works': 'briefcase', 'My Journey': 'route' };

function SectionSelector({ value, onChange, colors }) {
  const [width, setWidth] = useState(0);
  const idx = sections.indexOf(value);
  const left = (width / sections.length) * (idx < 0 ? 0 : idx);
  const anim = useRef(new Animated.Value(left)).current;
  useEffect(() => {
    const to = (width / sections.length) * (sections.indexOf(value));
    Animated.timing(anim, { toValue: to, duration: 400, easing: Easing.bezier(0.88, -0.35, 0.565, 1.35), useNativeDriver: false }).start();
  }, [value, width]);
  const pillWidth = width / sections.length;
  return (
    <View style={[st.switchWrap, { backgroundColor: colors.card, borderColor: colors.border }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Animated.View style={[st.switchPill, { left: anim, width: pillWidth, backgroundColor: colors.text }]} />
      {sections.map((s) => (
        <Pressable key={s} onPress={() => onChange(s)} style={st.switchItem}>
          <FA name={sectionIcons[s]} size={14} color={value === s ? colors.card : colors.text} style={{ marginRight: 6 }} />
          <Text style={[st.switchText, { color: value === s ? colors.card : colors.text }]}>{s}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function DrawerContent(props) {
  const { navigation } = props;
  const { mode, colors, cycle } = useThemeMode();
  const [section, setSection] = useState('Connect');
  const { logout } = useAuthStore();

  const go = (route, params) => {
    navigation.closeDrawer();
    if (route) navigation.navigate(route, params);
  };

  const menu = sharedMenu;

  const items = menu[section];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ padding: 16, backgroundColor: colors.card }}>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=60' }}
          style={{ height: 120, width: '100%', borderRadius: 12, backgroundColor: colors.border }}
        />
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=60' }}
          style={{ width: 72, height: 72, borderRadius: 36, marginTop: -36, borderWidth: 2, borderColor: '#FFF', backgroundColor: colors.border }}
        />
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
        <SectionSelector value={section} onChange={setSection} colors={colors} />
      </View>

      <View style={{ marginTop: 16 }}>
        {items.map((it) => (
          <Pressable key={it.label} onPress={() => go(it.route)} style={st.item}>
            <FA name={it.icon} size={14} color={colors.text} style={{ width: 24 }} />
            <Text style={[st.itemLabel, { color: colors.text }]}>{it.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 24, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 12 }}>
        <View style={st.footerIconsRow}>
          <Pressable onPress={() => go('Messages')} accessibilityLabel="Messages" style={[st.iconCircle, { borderColor: colors.border }]}>
            <FA name="envelope" size={16} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => go('Notifications')} accessibilityLabel="Notifications" style={[st.iconCircle, { borderColor: colors.border }]}>
            <FA name="bell" size={16} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => go('Settings')} accessibilityLabel="Settings" style={[st.iconCircle, { borderColor: colors.border }]}>
            <FA name="cog" size={16} color={colors.text} />
          </Pressable>
          <Pressable onPress={cycle} accessibilityLabel="Theme" style={[st.iconCircle, { borderColor: colors.border }]}>
            <FA name="adjust" size={16} color={colors.text} />
          </Pressable>
          <Pressable onPress={async () => {
            try { await signOutSession(); } catch (e) {}
            await logout();
            // Stay in app after logout to keep dev flow; go to Activity
            go('Activity');
          }} accessibilityLabel="Logout" style={[st.iconCircle, { borderColor: colors.border }]}>
            <FA name="sign-out-alt" size={16} color={colors.text} />
          </Pressable>
        </View>
        <Text style={{ marginTop: 8, color: '#888', textAlign: 'center' }}>V.1</Text>
      </View>
    </DrawerContentScrollView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Poppins_700Bold' }}>{value}</Text>
      <Text style={{ color: '#666', fontSize: 10}}>{label}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  switchWrap: { position: 'relative', flexDirection: 'row', alignItems: 'center', borderRadius: 28, padding: 4, marginTop: 12, overflow: 'hidden', borderWidth: 1 },
  switchPill: { position: 'absolute', top: 4, bottom: 4, borderRadius: 24, backgroundColor: '#111', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
  switchItem: { flex: 1, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontFamily: 'Poppins_600SemiBold', fontSize: 12},
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  itemLabel: { marginLeft: 8 },
  footerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  footerIconsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconCircle: { height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
});
