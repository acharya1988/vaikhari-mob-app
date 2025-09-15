import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useThemeMode } from '../theme/ThemeProvider';
import { useCopilotStore, COPILOT_MODES } from '../store/copilotStore';
import SidePanel from './SidePanel';

export default function CopilotSidebar() {
  const { colors } = useThemeMode();
  const { open, setOpen, mode, setMode, withContext, setWithContext, messages, query, setQuery, pushMessage } = useCopilotStore();

  const onSend = () => {
    if (!query.trim()) return;
    pushMessage({ id: String(Date.now()), role: 'user', text: query.trim() });
    setQuery('');
  };

  return (
    <SidePanel visible={open} onClose={() => setOpen(false)} side="left" width={100}>
      <View style={{ flex: 1, width: '100%' }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}> 
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={[styles.title, { color: colors.text }]}>Copilot</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityLabel="Close Copilot">
              <Text style={{ color: colors.text }}>Close</Text>
            </Pressable>
          </View>
          <View style={styles.modesRow}>
            {COPILOT_MODES.map((m) => (
              <Pressable key={m} onPress={() => setMode(m)} style={[styles.modeBtn, { borderColor: colors.border, backgroundColor: mode === m ? '#111' : colors.card }]}>
                <Text style={{ color: mode === m ? '#fff' : colors.text, fontSize: 12 }}>{m}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, padding: 8 }}>
            <ScrollView contentContainerStyle={{ gap: 8 }}>
              {messages.map((m) => (
                <View key={m.id} style={[styles.msg, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <Text style={{ color: colors.text }}>{m.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={[styles.rightPane, { borderLeftColor: colors.border }]}> 
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Context</Text>
            <View style={{ gap: 6 }}>
              <Row label="With Context" right={
                <Pressable onPress={() => setWithContext(!withContext)} style={[styles.toggle, { borderColor: colors.border, backgroundColor: withContext ? '#111' : colors.card }]}>
                  <Text style={{ color: withContext ? '#fff' : colors.text }}>{withContext ? 'On' : 'Off'}</Text>
                </Pressable>
              } />
              <Text style={{ color: colors.text }}>Auto-attach book/thread/circle.</Text>
            </View>
          </View>
        </View>

        <View style={[styles.inputBar, { borderTopColor: colors.border }]}> 
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Ask Copilot…"
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            multiline
          />
          <Pressable onPress={onSend} style={[styles.sendBtn, { backgroundColor: '#111' }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
          </Pressable>
        </View>
      </View>
    </SidePanel>
  );
}

function Row({ label, right }) {
  const { colors } = useThemeMode();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ color: colors.text }}>{label}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: 8, marginBottom: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontFamily: 'Poppins_700Bold', fontSize: 16 },
  modesRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  modeBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  msg: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, padding: 10 },
  rightPane: { width: 150, borderLeftWidth: StyleSheet.hairlineWidth, paddingLeft: 8 },
  sectionTitle: { fontFamily: 'Poppins_600SemiBold', marginBottom: 6 },
  toggle: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: StyleSheet.hairlineWidth, borderRadius: 999 },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, gap: 8 },
  input: { flex: 1, minHeight: 40, maxHeight: 100, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  sendBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
});
