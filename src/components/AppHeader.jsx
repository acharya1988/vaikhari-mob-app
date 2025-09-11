import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useThemeMode } from '../theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SidePanel from './SidePanel';
import Logo from '../design-collateral/Vaikhari logo.svg';

export default function AppHeader() {
  const nav = useNavigation();
  const { colors } = useThemeMode();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const openDrawer = () => {
    // Try to find parent drawer by id first
    if (nav.getParent) {
      const p = nav.getParent('RootDrawer');
      if (p && p.openDrawer) return p.openDrawer();
    }
    // Or walk up the tree until a drawer is found
    let p = nav;
    for (let i = 0; i < 6 && p; i++) {
      if (p.openDrawer) return p.openDrawer();
      p = p.getParent ? p.getParent() : undefined;
    }
    // If not in a drawer (e.g., on a Stack-only screen), navigate to Main then open
    try {
      nav.navigate('Main');
      setTimeout(() => {
        const root = nav.getParent && nav.getParent();
        const drawer = root?.getParent?.('RootDrawer') || root;
        if (drawer?.openDrawer) drawer.openDrawer();
      }, 30);
    } catch (e) {
      // Silent fallback to dispatch (may warn in dev if no drawer handles it)
      nav.dispatch(DrawerActions.openDrawer());
    }
  };

  return (
    <View style={[s.wrap, { paddingTop: insets.top, borderBottomColor: colors.border, backgroundColor: colors.card }]}> 
      <View style={s.left}>
        <Text style={[s.brand, { color: colors.text }]}>VAIKHARI</Text>
        <Pressable onPress={openDrawer} accessibilityLabel="Open menu" style={{ paddingHorizontal: 6, paddingVertical: 4 }}>
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
        <Pressable onPress={() => setOpen(true)} style={{ marginLeft: 6 }}>
          <Logo width={28} height={28} />
        </Pressable>
      </View>

      <SidePanel visible={open} onClose={() => setOpen(false)} side="right">
        <View style={{ flex: 1 }}>
          <Logo width={40} height={40} />
        </View>
      </SidePanel>
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
