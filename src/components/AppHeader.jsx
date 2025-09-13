import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeMode } from '../theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SidePanel from './SidePanel';
import Logo from '../design-collateral/Vaikhari logo.svg';
import CopilotSidebar from './CopilotSidebar';
// Copilot lives in its own left sidebar; minimal UI
import { useCopilotStore } from '../store/copilotStore';
import { useAuthStore } from '../store/authStore';
import { menu as sharedMenu, sections as sharedSections } from '../navigation/menu';

export default function AppHeader() {
  const nav = useNavigation();
  const { colors } = useThemeMode();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const { token } = useAuthStore();
  const { setOpen: setCopilotOpen } = useCopilotStore();

  const onOpenMenu = () => setOpen(true);
  //changes

  const sections = sharedSections;
  const menu = sharedMenu;

  const onGo = (route) => {
    setOpen(false);
    // Allow navigation even without token during development
    nav.navigate(route);
  };

  return (
    <View style={[s.wrap, { paddingTop: insets.top, borderBottomColor: colors.border, backgroundColor: colors.card }]}> 
      <View style={s.left}>
        <Text style={[s.brand, { color: colors.text }]}>VAIKHARI</Text>
        <Pressable onPress={onOpenMenu} accessibilityLabel="Open menu" style={{ paddingHorizontal: 1, paddingVertical: 4 }}>
          <FA name="bars" size={18} color={colors.text} />
        </Pressable>
      </View>
      <View style={s.center}>
        <FA name="search" size={14} color="#888" style={{ position: 'absolute', left: 10, top: 10 }} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search"
          placeholderTextColor="#888"
          style={[s.input, { color: colors.text, borderColor: colors.border }]}
          returnKeyType="search"
        />
      </View>
      <View style={s.right}>
        <Pressable
          onPress={() => setCopilotOpen(true)}
          onLongPress={() => setCopilotOpen(true)}
          delayLongPress={250}
          style={{ marginLeft: 6 }}
          accessibilityLabel="Open Copilot"
        >
          <Logo width={38} height={38} />
        </Pressable>
      </View>

      <SidePanel visible={open} onClose={() => setOpen(false)} side="right">
        <View style={{ padding: 12, gap: 12, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Logo width={36} height={36} />
            <Text style={{ fontFamily: 'Poppins_700Bold' }}>Navigation</Text>
          </View>
          {!token ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={() => { setOpen(false); nav.navigate('SignIn'); }} style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12 }}>
                <Text>Sign In</Text>
              </Pressable>
              <Pressable onPress={() => { setOpen(false); nav.navigate('SignUp'); }} style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12 }}>
                <Text>Create Account</Text>
              </Pressable>
            </View>
          ) : null}
          <ScrollView>
            {sections.map((sec) => (
              <View key={sec} style={{ marginBottom: 12 }}>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', marginBottom: 6 }}>{sec}</Text>
                {menu[sec].map((it) => (
                  <Pressable key={it.label} onPress={() => onGo(it.route)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                    <FA name={it.icon} size={14} color={colors.text} style={{ width: 22 }} />
                    <Text style={{ marginLeft: 8 }}>{it.label}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </SidePanel>

      {/* Copilot left sidebar */}
      <CopilotSidebar />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  center: { flex: 1, marginHorizontal: 8, justifyContent: 'center' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: { backgroundColor: '#F7F7F7', borderRadius: 24, paddingLeft: 36, paddingRight: 12, height: 42, borderWidth: 1 },
  brand: { fontFamily: 'Poppins_700Bold', letterSpacing: 1 },
});
