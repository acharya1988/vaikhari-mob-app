import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal,
  SafeAreaView, ScrollView, Pressable, Platform
} from 'react-native';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import ContextBottomBar from '../components/ContextBottomBar';
import { useThemeMode } from '../theme/ThemeProvider';
import { showMessage, _toastVariants } from '../utils/toast';

// -----------------------------------------------------
// Tabs
// -----------------------------------------------------
const TABS = ['chats', 'dm', 'circle', 'chintana'];
const CIRCLE_TYPES = ['Purva Paksha','Uttara Paksha','Siddhanta','Question','Thought','Reflection'];
const CHINTANA_MODES = ['Question','Purva Paksha','Uttara Paksha','Siddhanta'];

// -----------------------------------------------------
// Mock Data (replace with API later)
// -----------------------------------------------------
const MOCK_CHATS = [
  { id: 'u1', name: 'Vaidya Dr. Meera', last: 'Share the Purva Paksha doc? 📄', ts: 1694352120, unread: 2, pinned: false, online: true },
  { id: 'u2', name: 'Dr. Kiran', last: 'Siddhānta draft looks solid.', ts: 1694351400, unread: 0, pinned: false, online: false },
];

// Dedicated DM threads (one-to-one only)
const DM_THREADS = [
  { id: 'dm1', name: 'Vaidya Dr. Meera', last: 'Share the Purva Paksha doc? 📄', ts: 1694352120, unread: 2, online: true },
  { id: 'dm2', name: 'Dr. Kiran', last: 'Siddhānta draft looks solid.', ts: 1694351400, unread: 0, online: false },
];

const MOCK_THREAD = [
  { id: 'm1', from: 'them', text: 'Namaste! You joining tonight?', ts: 1694350200, status: 'read' },
  { id: 'm2', from: 'me', text: 'Yes. I’ll present Purva Paksha first.', ts: 1694350500, status: 'read' },
  { id: 'm3', from: 'them', text: 'Perfect. See you 7PM.', ts: 1694350600, status: 'delivered' },
];

// Circles and their messages (root posts)
const MOCK_CIRCLES = ['Panchakarma', 'Rasayana', 'Agada Tantra'];
const MOCK_CIRCLE_ROOTS = {
  Panchakarma: [
    { id: 'c1', type: 'Question', text: 'Is langhana without dīpana effective in Āma-jvara?' },
    { id: 'c2', type: 'Purva Paksha', text: 'Langhana alone risks agni depletion; add mild dīpana.' },
    { id: 'c3', type: 'Uttara Paksha', text: 'Initial langhana okay if ruksha-ushna ahara follows.' },
  ],
  Rasayana: [
    { id: 'c4', type: 'Question', text: 'Best dīrgha-kāla rasāyana for vāta-pradhāna prakṛti?' },
    { id: 'c5', type: 'Reflection', text: 'Small-dose amalaki with ghee improved sleep quality.' },
  ],
  'Agada Tantra': [
    { id: 'c6', type: 'Question', text: 'First-responder herbs in madhu-visha suspected case?' },
  ],
};
// Thread replies per circle root id
const MOCK_CIRCLE_THREADS = {
  c1: [
    { id: 'r1', from: 'them', text: 'Start with mild langhana, watch bala/ojas.', ts: 1694352600 },
    { id: 'r2', from: 'me', text: 'Agree. Add pippali micro-doses as dīpana.', ts: 1694352700 },
  ],
  c2: [{ id: 'r3', from: 'me', text: 'Case report: agni dipti after minimal langhana day 2.', ts: 1694352800 }],
  c3: [{ id: 'r4', from: 'them', text: 'Ensure ruksha-ushna pathya continues 48h.', ts: 1694352900 }],
  c4: [{ id: 'r5', from: 'them', text: 'Amalaki, guduchi, shilajit (patient-specific).', ts: 1694353000 }],
  c5: [{ id: 'r6', from: 'me', text: 'Track HRV & sleep; titrate dose weekly.', ts: 1694353100 }],
  c6: [{ id: 'r7', from: 'them', text: 'Vacha, haridra; urgent referral if systemic.', ts: 1694353200 }],
};

// Chintana roots and replies
const MOCK_CHINTANA_ROOTS = [
  { id: 'q1', role: 'Question', text: 'Is tridoṣa “sama” baseline or prakṛti-biased normal?', pinned: false },
  { id: 'p1', role: 'Purva Paksha', text: 'Baseline is sama; habitual deviations = vikṛti.', pinned: false },
  { id: 'u1', role: 'Uttara Paksha', text: 'Prakṛti bias is normal; aim harmony, not perfect sama.', pinned: false },
  { id: 's1', role: 'Siddhanta', text: 'Assess “sama” vs prakṛti; treat functional divergence.', pinned: false },
];
const MOCK_CHINTANA_THREADS = {
  q1: [
    { id: 'z1', from: 'them', text: 'Clinical frame prefers function over numbers.', ts: 1694354000 },
    { id: 'z2', from: 'me', text: 'Right—measure outcomes, not ideals.', ts: 1694354100 },
  ],
  p1: [{ id: 'z3', from: 'me', text: 'Need longitudinal data to call it vikṛti.', ts: 1694354200 }],
  u1: [{ id: 'z4', from: 'them', text: 'Harmony metric should be contextual.', ts: 1694354300 }],
  s1: [{ id: 'z5', from: 'them', text: 'Then protocol becomes adaptive by prakṛti.', ts: 1694354400 }],
};

// -----------------------------------------------------
// Screen: WhatsApp-style Home
// -----------------------------------------------------
export default function WhatsAppReplacer({ navigation }) {
  const { colors, mode } = useThemeMode();
  const [tab, setTab] = useState('chats');
  const [composeOpen, setComposeOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [circlePickerOpen, setCirclePickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [circle, setCircle] = useState(MOCK_CIRCLES[0]);
  const [circleFilter, setCircleFilter] = useState(Object.fromEntries(CIRCLE_TYPES.map(t => [t, true])));
  const [pinnedDM, setPinnedDM] = useState({});
  const [pinnedCircle, setPinnedCircle] = useState({});
  const [pinnedChintana, setPinnedChintana] = useState(Object.fromEntries(MOCK_CHINTANA_ROOTS.map(r => [r.id, !!r.pinned])));
  const isGrey = mode === 'grey';

  // All threads (DM + Circle + Chintana)
  const allThreads = useMemo(() => {
    const dm = DM_THREADS.map(t => ({
      key: `dm:${t.id}`,
      kind: 'dm',
      id: t.id,
      name: t.name,
      last: t.last,
      ts: t.ts,
      unread: t.unread || 0,
      online: t.online || false,
      pinned: !!pinnedDM[t.id],
    }));

    const circleAll = Object.entries(MOCK_CIRCLE_ROOTS).flatMap(([circleName, roots]) =>
      roots.map((r, i) => {
        const replies = MOCK_CIRCLE_THREADS[r.id] || [];
        const latest = replies[replies.length - 1];
        const ts = latest?.ts || 1694350000 - i * 60;
        const last = latest?.text || r.text;
        return {
          key: `circle:${r.id}`,
          kind: 'circle',
          id: r.id,
          circle: circleName,
          name: `Circle • ${circleName}: ${r.type}`,
          last,
          ts,
          unread: 0,
          pinned: !!pinnedCircle[r.id],
        };
      })
    );

    const chint = MOCK_CHINTANA_ROOTS.map((r, i) => {
      const replies = MOCK_CHINTANA_THREADS[r.id] || [];
      const latest = replies[replies.length - 1];
      const ts = latest?.ts || 1694349000 - i * 60;
      const last = latest?.text || r.text;
      return {
        key: `ch:${r.id}`,
        kind: 'chintana',
        id: r.id,
        name: `Chintana • ${r.role}`,
        last,
        ts,
        unread: 0,
        canPin: true,
        pinned: !!pinnedChintana[r.id],
      };
    });

    let items = [...dm, ...circleAll, ...chint];
    // Filter by query
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(x => x.name.toLowerCase().includes(q) || (x.last || '').toLowerCase().includes(q));
    }
    // Sort: pinned first, then by ts desc
    items.sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || (b.ts || 0) - (a.ts || 0));
    return items;
  }, [query, pinnedDM, pinnedCircle, pinnedChintana]);

  // DM threads only
  const dmThreads = useMemo(() => {
    let items = DM_THREADS;
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(t => t.name.toLowerCase().includes(q) || (t.last||'').toLowerCase().includes(q));
    }
    return items.sort((a,b) => (b.ts||0) - (a.ts||0));
  }, [query]);

  const circleRoots = useMemo(() => {
    const list = (MOCK_CIRCLE_ROOTS[circle] || []).filter(x => circleFilter[x.type]);
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(x => x.text.toLowerCase().includes(q) || x.type.toLowerCase().includes(q));
  }, [circle, circleFilter, query]);

  const circleThreads = useMemo(() => {
    return circleRoots.map((r, i) => {
      const replies = MOCK_CIRCLE_THREADS[r.id] || [];
      const latest = replies[replies.length - 1];
      const ts = latest?.ts || 1694350000 - i * 60;
      const last = latest?.text || r.text;
      return { key: `circle:${r.id}`, kind: 'circle', id: r.id, circle, name: `${circle} • ${r.type}`, last, ts, unread: 0 };
    });
  }, [circleRoots, circle]);

  const chintanaRoots = useMemo(() => {
    const list = [...MOCK_CHINTANA_ROOTS];
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(x => x.text.toLowerCase().includes(q) || x.role.toLowerCase().includes(q));
  }, [query]);

  const content = useMemo(() => {
    if (tab === 'chats') {
      return (
        <ThreadList
          colors={colors}
          threads={allThreads}
          onOpen={(item) => {
            if (!navigation) return;
            if (item.kind === 'dm') navigation.navigate('ChatThread', { chatId: item.id, name: item.name });
            if (item.kind === 'circle') navigation.navigate('CircleThread', { circle: item.circle, root: { id: item.id, type: item.name.split(': ')[1], text: item.last } });
            if (item.kind === 'chintana') navigation.navigate('ChintanaThread', { root: { id: item.id, role: item.name.replace('Chintana • ', ''), text: item.last } });
          }}
          onLongPin={(item) => {
            if (item.kind === 'dm') {
              const count = Object.values(pinnedDM).filter(Boolean).length;
              const next = !pinnedDM[item.id];
              if (next && count >= 5) return showMessage({ message: 'Max 5 pinned in Messages', variant: _toastVariants.Warn });
              setPinnedDM(m => ({ ...m, [item.id]: next }));
              return;
            }
            if (item.kind === 'circle') {
              const count = Object.values(pinnedCircle).filter(Boolean).length;
              const next = !pinnedCircle[item.id];
              if (next && count >= 5) return showMessage({ message: 'Max 5 pinned in Circles', variant: _toastVariants.Warn });
              setPinnedCircle(m => ({ ...m, [item.id]: next }));
              return;
            }
            if (item.kind === 'chintana') {
              const count = Object.values(pinnedChintana).filter(Boolean).length;
              const next = !pinnedChintana[item.id];
              if (next && count >= 5) return showMessage({ message: 'Max 5 pinned in Chintana', variant: _toastVariants.Warn });
              setPinnedChintana(m => ({ ...m, [item.id]: next }));
            }
          }}
          tintPinned
          isGrey={isGrey}
        />
      );
    }
    if (tab === 'dm') {
      return (
        <ThreadList
          colors={colors}
          threads={dmThreads.map(t => ({ key: t.id, kind: 'dm', id: t.id, name: t.name, last: t.last, ts: t.ts, unread: t.unread, online: t.online, pinned: !!pinnedDM[t.id] }))}
          onOpen={(item) => navigation && navigation.navigate('ChatThread', { chatId: item.id, name: item.name })}
          onLongPin={(item) => {
            const count = Object.values(pinnedDM).filter(Boolean).length;
            const next = !pinnedDM[item.id];
            if (next && count >= 5) return showMessage({ message: 'Max 5 pinned in Messages', variant: _toastVariants.Warn });
            setPinnedDM(m => ({ ...m, [item.id]: next }));
          }}
          tintPinned
          isGrey={isGrey}
        />
      );
    }
    if (tab === 'circle') {
      return (
        <View style={{ gap: 8 }}>
          <View style={[st.topBar, { borderColor: colors.border }]}>
            <TouchableOpacity onPress={() => setCirclePickerOpen(true)}>
              <Text style={[st.topBarTitle, { color: colors.text }]}>Circle: {circle} ⌄</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilterOpen(true)} style={st.iconBtn}><FA name="filter" size={16} color={colors.text} /></TouchableOpacity>
          </View>
          <ThreadList
            colors={colors}
            threads={circleThreads.map(t => ({ ...t, pinned: !!pinnedCircle[t.id] }))}
            onOpen={(item) => navigation && navigation.navigate('CircleThread', { circle, root: { id: item.id, type: item.name.split(' • ')[1], text: item.last } })}
            onLongPin={(item) => {
              const count = Object.values(pinnedCircle).filter(Boolean).length;
              const next = !pinnedCircle[item.id];
              if (next && count >= 5) return showMessage({ message: 'Max 5 pinned in Circles', variant: _toastVariants.Warn });
              setPinnedCircle(m => ({ ...m, [item.id]: next }));
            }}
            tintPinned
            isGrey={isGrey}
          />
        </View>
      );
    }
    return (
      <ThreadList
        colors={colors}
        threads={chintanaRoots.map((r, i) => {
          const replies = MOCK_CHINTANA_THREADS[r.id] || [];
          const latest = replies[replies.length - 1];
          const ts = latest?.ts || 1694349000 - i * 60;
          const last = latest?.text || r.text;
          return { key: `ch:${r.id}`, kind: 'chintana', id: r.id, name: `Chintana • ${r.role}`, last, ts, unread: 0, canPin: true, pinned: !!pinnedChintana[r.id] };
        })}
        onOpen={(item) => navigation && navigation.navigate('ChintanaThread', { root: { id: item.id, role: item.name.replace('Chintana • ', ''), text: item.last } })}
        onLongPin={(item) => {
          const count = Object.values(pinnedChintana).filter(Boolean).length;
          const next = !pinnedChintana[item.id];
          if (next && count >= 5) return showMessage({ message: 'Max 5 pinned in Chintana', variant: _toastVariants.Warn });
          setPinnedChintana(m => ({ ...m, [item.id]: next }));
        }}
        tintPinned
        isGrey={isGrey}
      />
    );
  }, [tab, colors, allThreads, dmThreads, navigation, circle, circleRoots, circleThreads, chintanaRoots, pinnedDM, pinnedCircle, pinnedChintana, isGrey]);

  return (
    <View style={[st.page, { backgroundColor: colors.bg }]}>
      <AppHeader />

      {/* Search + Circle filter/chooser */}
      <View style={[st.searchRow, { borderColor: colors.border }]}>
        <FA name="search" size={14} color="#888" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          style={[st.searchInput, { color: colors.text }]}
        />
        {tab === 'circle' ? (
          <>
            <TouchableOpacity onPress={() => setCirclePickerOpen(true)} style={st.iconBtn}>
              <FA name="users" size={16} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilterOpen(true)} style={st.iconBtn}>
              <FA name="filter" size={16} color={colors.text} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 140 }}>
        {content}
      </ScrollView>

      <ContextBottomBar
        items={[
          { key: 'chats', icon: 'comments' },
          { key: 'dm', icon: 'envelope' },
          { key: 'circle', icon: 'users' },
          { key: 'chintana', icon: 'pen' },
        ]}
        value={tab}
        onChange={setTab}
        onFab={() => setComposeOpen(v => !v)}
      />

      {/* Compose (contextual) */}
      <Modal visible={composeOpen} transparent animationType="slide" onRequestClose={() => setComposeOpen(false)}>
        <View style={st.sheetBackdrop}>
          <View style={[st.sheet, { backgroundColor: colors.card }]}>
            <View style={[st.sheetHandle, { backgroundColor: colors.border }]} />
            {tab === 'chats' && <QuickNewChat colors={colors} onClose={() => setComposeOpen(false)} />}
            {tab === 'dm' && <DMCompose colors={colors} />}
            {tab === 'circle' && <CircleCompose colors={colors} />}
            {tab === 'chintana' && <ChintanaCompose colors={colors} />}
            <TouchableOpacity style={st.sheetClose} onPress={() => setComposeOpen(false)}>
              <Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Circle filter sheet */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <View style={st.sheetBackdrop}>
          <View style={[st.sheet, { backgroundColor: colors.card }]}>
            <View style={[st.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[st.sheetTitle, { color: colors.text }]}>Filter types</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {CIRCLE_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setCircleFilter(m => ({ ...m, [t]: !m[t] }))}
                  style={[st.chip, { borderColor: colors.border, backgroundColor: circleFilter[t] ? '#0F172A' : 'transparent' }]}
                >
                  <Text style={{ color: circleFilter[t] ? '#FFF' : colors.text }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={st.sheetClose} onPress={() => setFilterOpen(false)}>
              <Text style={[st.sheetCloseText, { color: colors.text }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Circle picker */}
      <Modal visible={circlePickerOpen} transparent animationType="fade" onRequestClose={() => setCirclePickerOpen(false)}>
        <View style={st.pickerBackdrop}>
          <View style={[st.pickerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[st.sheetTitle, { color: colors.text, marginBottom: 12 }]}>Choose Circle</Text>
            {MOCK_CIRCLES.map((c) => (
              <TouchableOpacity key={c} onPress={() => { setCircle(c); setCirclePickerOpen(false); }} style={st.pickerRow}>
                <FA name="users" size={14} color={colors.text} />
                <Text style={{ color: colors.text, marginLeft: 8 }}>{c}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[st.sheetClose, { alignSelf: 'flex-end' }]} onPress={() => setCirclePickerOpen(false)}>
              <Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// -----------------------------------------------------
// Chats List
// -----------------------------------------------------
function ThreadList({ colors, threads, onOpen, onLongPin, tintPinned = false, isGrey = false }) {
  return (
    <View style={{ gap: 4 }}>
      {threads.map((c) => (
        <TouchableOpacity
          key={c.key || c.id}
          onPress={() => onOpen && onOpen(c)}
          onLongPress={() => onLongPin && onLongPin(c)}
          style={[st.chatRow, {
            borderColor: colors.border,
            backgroundColor: tintPinned && c.pinned
              ? (c.kind === 'dm' ? (isGrey ? '#e5e5e5' : 'rgba(59,130,246,0.10)')
                : c.kind === 'circle' ? (isGrey ? '#ececec' : 'rgba(245,158,11,0.12)')
                : (isGrey ? '#f0f0f0' : 'rgba(234,88,12,0.10)'))
              : 'transparent',
            borderRadius: 10,
            paddingHorizontal: 8,
          }]}
        >
          <View style={st.avatarWrap}>
            <View style={[st.avatar, { backgroundColor: '#0F172A' }]}>
              <Text style={{ color: '#FFF', fontWeight: '700' }}>{initials(c.name)}</Text>
            </View>
            {c.online ? <View style={[st.onlineDot, { backgroundColor: isGrey ? '#6b7280' : '#10b981', borderColor: isGrey ? '#e5e7eb' : '#fff' }]} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <View style={st.chatTop}>
              <Text numberOfLines={1} style={[st.chatName, { color: colors.text }]}>{c.name}{c.pinned ? '  📌' : ''}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {c.pinned ? <FA name="thumbtack" size={12} color={isGrey ? '#333' : '#eab308'} /> : null}
                <Text style={[st.timeText, { color: '#888' }]}>{formatTimeFromTs(c.ts)}</Text>
              </View>
            </View>
            <View style={st.chatBottom}>
              <Text numberOfLines={1} style={[st.lastText, { color: '#666' }]}>{c.last}</Text>
              {c.unread > 0 ? (
                <View style={[st.badge, { backgroundColor: colors.text }]}><Text style={[st.badgeText, { color: colors.card }]}>{c.unread}</Text></View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// -----------------------------------------------------
// DM Tab (simple preview)
// -----------------------------------------------------
function DMOnly({ colors }) {
  return (
    <View style={{ gap: 8 }}>
      <Section title="Direct Messages" colors={colors}>
        {MOCK_THREAD.map(m => (
          <Bubble key={m.id} colors={colors} me={m.from === 'me'} text={m.text} status={m.status} time={formatTime(m.ts)} />
        ))}
      </Section>
    </View>
  );
}

// -----------------------------------------------------
// Circle Tab (list + tap to thread)
// -----------------------------------------------------
function CircleOnly({ colors, circle, setCircle, roots, onOpenThread, onFilterSheet }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={[st.topBar, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={setCircle}>
          <Text style={[st.topBarTitle, { color: colors.text }]}>Circle: {circle} ⌄</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onFilterSheet} style={st.iconBtn}><FA name="filter" size={16} color={colors.text} /></TouchableOpacity>
      </View>
      <View style={{ gap: 8 }}>
        {roots.map((m) => (
          <TouchableOpacity key={m.id} onPress={() => onOpenThread && onOpenThread(m)}>
            <CircleItem colors={colors} type={m.type} text={m.text} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// -----------------------------------------------------
// Chintana Tab (list + tap to thread)
// -----------------------------------------------------
function ChintanaOnly({ colors, roots, onOpenThread }) {
  return (
    <View style={{ gap: 8 }}>
      {roots.map((m) => (
        <TouchableOpacity key={m.id} onPress={() => onOpenThread && onOpenThread(m)}>
          <ChintanaItem colors={colors} role={m.role} text={m.text} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// -----------------------------------------------------
// THREAD SCREENS
// -----------------------------------------------------
export function ChatThread({ route }) {
  const { colors } = useThemeMode();
  const { chatId, name } = route?.params || {};
  const [messages, setMessages] = useState(MOCK_THREAD);
  const [replyTo, setReplyTo] = useState(null);
  const listRef = useRef(null);

  useEffect(() => { setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 0); }, []);

  const onSend = (text) => {
    if (!text?.trim()) return;
    const msg = {
      id: 'm' + Math.random().toString(36).slice(2, 7),
      from: 'me',
      text: replyTo ? `↪ ${replyTo.text}\n${text}` : text,
      ts: Date.now() / 1000,
      status: 'sent',
    };
    setMessages(prev => [...prev, msg]);
    setReplyTo(null);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'delivered' } : m));
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
      }, 800);
    }, 700);
  };

  const onLongPress = (m) => setReplyTo(m);

  const renderItem = ({ item }) => (
    <Pressable onLongPress={() => onLongPress(item)}>
      <Bubble
        colors={colors}
        me={item.from === 'me'}
        text={item.text}
        status={item.status}
        time={formatTime(item.ts)}
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={[st.page, { backgroundColor: colors.bg }]}>
      <ThreadHeader colors={colors} title={name || 'Chat'} />
      <FlatList
        ref={listRef}
        contentContainerStyle={{ padding: 12, paddingBottom: 96 }}
        data={messages}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        onContentSizeChange={() => setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 0)}
      />
      <InputBar colors={colors} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} onSend={onSend} />
    </SafeAreaView>
  );
}

export function CircleThread({ route }) {
  const { colors } = useThemeMode();
  const { circle, root } = route?.params || {};
  const [messages, setMessages] = useState(MOCK_CIRCLE_THREADS[root?.id] || []);
  const [replyTo, setReplyTo] = useState(null);
  const listRef = useRef(null);

  useEffect(() => { setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 0); }, []);

  const onSend = (text) => {
    if (!text?.trim()) return;
    const msg = { id: 'r' + Math.random().toString(36).slice(2,7), from: 'me', text, ts: Date.now() / 1000 };
    setMessages(prev => [...prev, msg]);
    setReplyTo(null);
  };

  const renderItem = ({ item }) => (
    <Pressable onLongPress={() => setReplyTo(item)}>
      <Bubble colors={colors} me={item.from === 'me'} text={item.text} time={formatTime(item.ts)} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[st.page, { backgroundColor: colors.bg }]}>
      <ThreadHeader colors={colors} title={`${circle} • ${root?.type}`} subtitle={root?.text} />
      <FlatList
        ref={listRef}
        contentContainerStyle={{ padding: 12, paddingBottom: 96 }}
        data={messages}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        onContentSizeChange={() => setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 0)}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 8 }}>
            <CircleItem colors={colors} type={root?.type} text={root?.text} />
            <Text style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Thread replies</Text>
          </View>
        )}
      />
      <InputBar colors={colors} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} onSend={onSend} />
    </SafeAreaView>
  );
}

export function ChintanaThread({ route }) {
  const { colors } = useThemeMode();
  const { root } = route?.params || {};
  const [messages, setMessages] = useState(MOCK_CHINTANA_THREADS[root?.id] || []);
  const [replyTo, setReplyTo] = useState(null);
  const listRef = useRef(null);

  useEffect(() => { setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 0); }, []);

  const onSend = (text) => {
    if (!text?.trim()) return;
    const msg = { id: 'z' + Math.random().toString(36).slice(2,7), from: 'me', text, ts: Date.now() / 1000 };
    setMessages(prev => [...prev, msg]);
    setReplyTo(null);
  };

  const renderItem = ({ item }) => (
    <Pressable onLongPress={() => setReplyTo(item)}>
      <Bubble colors={colors} me={item.from === 'me'} text={item.text} time={formatTime(item.ts)} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[st.page, { backgroundColor: colors.bg }]}>
      <ThreadHeader colors={colors} title={`Chintana • ${root?.role}`} subtitle={root?.text} />
      <FlatList
        ref={listRef}
        contentContainerStyle={{ padding: 12, paddingBottom: 96 }}
        data={messages}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        onContentSizeChange={() => setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 0)}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 8 }}>
            <ChintanaItem colors={colors} role={root?.role} text={root?.text} />
            <Text style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Thread replies</Text>
          </View>
        )}
      />
      <InputBar colors={colors} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} onSend={onSend} />
    </SafeAreaView>
  );
}

// -----------------------------------------------------
// Shared Bits
// -----------------------------------------------------
function Section({ title, colors, children }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>{title}</Text>
      <View style={{ gap: 8 }}>{children}</View>
    </View>
  );
}

function Bubble({ colors, me, text, status = 'sent', time }) {
  const { mode } = useThemeMode();
  const isGrey = mode === 'grey';
  const bg = me ? (isGrey ? '#111' : '#0F172A') : (isGrey ? '#EEE' : '#F7F7F7');
  const border = me ? (isGrey ? '#111' : '#0F172A') : colors.border;
  const fg = me ? '#fff' : colors.text;
  return (
    <View style={{ alignItems: me ? 'flex-end' : 'flex-start' }}>
      <View style={[st.bubble, { backgroundColor: bg, borderColor: border, maxWidth: '86%' }]}>
        <Text style={{ color: fg, lineHeight: 20 }}>{text}</Text>
        <View style={st.rowEnd}>
          {time ? <Text style={[st.timeTiny, { color: me ? (isGrey ? '#e5e7eb' : '#cbd5e1') : '#64748b' }]}>{time}  </Text> : null}
          {me ? <Tick status={status} /> : null}
        </View>
      </View>
    </View>
  );
}

function Tick({ status }) {
  // 'sent' | 'delivered' | 'read'
  const icon = status === 'read' ? 'check-double' : status === 'delivered' ? 'check-double' : 'check';
  const color = status === 'read' ? '#60a5fa' : '#94a3b8';
  return <FA name={icon} size={12} color={color} />;
}

function CircleItem({ colors, type, text }) {
  const { mode } = useThemeMode();
  const tint = typeStyle(type, mode === 'grey');
  return (
    <View style={[st.circleItem, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={[st.typePill, { backgroundColor: tint.bg }]}><Text style={[st.typePillText, { color: tint.fg }]}>{type}</Text></View>
      <Text style={{ color: colors.text }}>{text}</Text>
    </View>
  );
}

function ChintanaItem({ colors, role, text }) {
  const { mode } = useThemeMode();
  const tint = typeStyle(role, mode === 'grey');
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <View style={[st.bubble, { backgroundColor: tint.bg, borderColor: tint.border, maxWidth: '100%' }]}>
        <Text style={{ color: tint.fg, fontWeight: '700', marginBottom: 2 }}>{role}</Text>
        <Text style={{ color: tint.fg }}>{text}</Text>
      </View>
    </View>
  );
}

function InputBar({ colors, replyTo, onCancelReply, onSend }) {
  const [text, setText] = useState('');
  return (
    <View style={[st.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
      {replyTo ? (
        <View style={st.replyBar}>
          <Text numberOfLines={1} style={[st.replyText, { color: colors.text }]}>Replying to: {replyTo.text}</Text>
          <TouchableOpacity onPress={onCancelReply} style={st.iconBtn}><FA name="times" size={14} color={colors.text} /></TouchableOpacity>
        </View>
      ) : null}
      <View style={st.inputRow}>
        <TouchableOpacity style={st.iconBtn}><FA name="smile" size={18} color={colors.text} /></TouchableOpacity>
        <TextInput
          placeholder="Message"
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
          style={[st.input, { flex: 1, borderColor: colors.border, color: colors.text }]}
          multiline
        />
        <TouchableOpacity style={st.iconBtn}><FA name="paperclip" size={18} color={colors.text} /></TouchableOpacity>
        <TouchableOpacity style={[st.sendBtn, { backgroundColor: colors.text }]} onPress={() => { onSend(text); setText(''); }}>
          <FA name="paper-plane" size={16} color={colors.card} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function QuickNewChat({ colors, onClose }) {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  return (
    <View>
      <Text style={[st.sheetTitle, { color: colors.text }]}>New chat</Text>
      <TextInput placeholder="To (name/phone)" placeholderTextColor="#888" value={to} onChangeText={setTo} style={[st.input, { borderColor: colors.border, color: colors.text, marginBottom: 8 }]} />
      <TextInput placeholder="Message…" placeholderTextColor="#888" value={message} onChangeText={setMessage} style={[st.input, { borderColor: colors.border, color: colors.text }]} multiline />
      <TouchableOpacity style={[st.primaryBtn, { backgroundColor: colors.text }]} onPress={onClose}><Text style={[st.primaryBtnText, { color: colors.card }]}>Start</Text></TouchableOpacity>
    </View>
  );
}

function DMCompose({ colors }) {
  const [text, setText] = useState('');
  return (
    <View>
      <Text style={[st.sheetTitle, { color: colors.text }]}>Quick DM</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TouchableOpacity style={[st.iconCircle]}><FA name="smile" size={18} color={colors.text} /></TouchableOpacity>
        <TextInput
          placeholder="Message"
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
          style={[st.input, { flex: 1, borderColor: colors.border, color: colors.text }]}
        />
        <TouchableOpacity style={[st.sendBtn]}><FA name="paper-plane" size={16} color="#FFF" /></TouchableOpacity>
      </View>
    </View>
  );
}

function CircleCompose({ colors }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('Thought');
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={[st.sheetTitle, { color: colors.text, flex: 1 }]}>New circle message</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
        {CIRCLE_TYPES.map((t) => (
          <TouchableOpacity key={t} onPress={() => setType(t)} style={[st.chip, { borderColor: colors.border, backgroundColor: type === t ? '#0F172A' : 'transparent' }]}>
            <Text style={{ color: type === t ? '#FFF' : colors.text }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TextInput
        placeholder={`Write a ${type.toLowerCase()}…`}
        placeholderTextColor="#888"
        value={text}
        onChangeText={setText}
        style={[st.input, { borderColor: colors.border, color: colors.text }]}
        multiline
      />
      <TouchableOpacity style={[st.primaryBtn, { backgroundColor: colors.text }]}><Text style={[st.primaryBtnText, { color: colors.card }]}>Post</Text></TouchableOpacity>
    </View>
  );
}

function ChintanaCompose({ colors }) {
  const [mode, setMode] = useState('Question');
  const [text, setText] = useState('');
  return (
    <View>
      <Text style={[st.sheetTitle, { color: colors.text }]}>Chintana</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
        {CHINTANA_MODES.map((m) => (
          <TouchableOpacity key={m} onPress={() => setMode(m)} style={[st.chip, { borderColor: colors.border, backgroundColor: mode === m ? '#0F172A' : 'transparent' }]}>
            <Text style={{ color: mode === m ? '#FFF' : colors.text }}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TextInput
        placeholder={`Write ${mode.toLowerCase()}…`}
        placeholderTextColor="#888"
        value={text}
        onChangeText={setText}
        style={[st.input, { borderColor: colors.border, color: colors.text }]}
        multiline
      />
      <TouchableOpacity style={[st.primaryBtn, { backgroundColor: colors.text }]}><Text style={[st.primaryBtnText, { color: colors.card }]}>Submit</Text></TouchableOpacity>
    </View>
  );
}

function ThreadHeader({ colors, title, subtitle }) {
  return (
    <View style={[st.threadTop, { borderColor: colors.border }]}>
      <View style={st.avatarSmall}><Text style={{ color: '#FFF', fontWeight: '700' }}>{initials(title || 'Chat')}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={[st.chatName, { color: colors.text }]} numberOfLines={1}>{title || 'Chat'}</Text>
        {subtitle ? <Text style={{ color: '#6b7280', fontSize: 12 }} numberOfLines={1}>{subtitle}</Text> : <Text style={{ color: '#6b7280', fontSize: 12 }}>online</Text>}
      </View>
      <TouchableOpacity style={st.iconBtn}><FA name="phone" size={16} color={colors.text} /></TouchableOpacity>
      <TouchableOpacity style={st.iconBtn}><FA name="video" size={16} color={colors.text} /></TouchableOpacity>
      <TouchableOpacity style={st.iconBtn}><FA name="ellipsis-v" size={16} color={colors.text} /></TouchableOpacity>
    </View>
  );
}

// -----------------------------------------------------
// Utils & Styles
// -----------------------------------------------------
function initials(name = '') {
  const parts = name.split(' ').filter(Boolean);
  if (!parts.length) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function formatTime(ts) {
  try {
    const d = new Date(ts * 1000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch {
    return '';
  }
}
function formatTimeFromTs(ts) {
  if (!ts) return '';
  return formatTime(ts);
}
function typeStyle(type, isGrey = false) {
  switch (type) {
    case 'Purva Paksha': return isGrey ? { bg: '#EEEEEE', fg: '#111', border: '#E5E5E5' } : { bg: 'rgba(59,130,246,0.12)', fg: '#0B4BC8', border: 'rgba(59,130,246,0.24)' };
    case 'Uttara Paksha': return isGrey ? { bg: '#F0F0F0', fg: '#111', border: '#E5E5E5' } : { bg: 'rgba(16,185,129,0.12)', fg: '#0B7A5E', border: 'rgba(16,185,129,0.24)' };
    case 'Siddhanta': return isGrey ? { bg: '#F2F2F2', fg: '#111', border: '#E5E5E5' } : { bg: 'rgba(245,158,11,0.12)', fg: '#8A5A06', border: 'rgba(245,158,11,0.24)' };
    case 'Question': return isGrey ? { bg: '#EAEAEA', fg: '#111', border: '#E5E5E5' } : { bg: 'rgba(99,102,241,0.12)', fg: '#3730A3', border: 'rgba(99,102,241,0.24)' };
    case 'Reflection': return isGrey ? { bg: '#EDEDED', fg: '#111', border: '#E5E5E5' } : { bg: 'rgba(234,88,12,0.12)', fg: '#9A3412', border: 'rgba(234,88,12,0.24)' };
    case 'Thought':
    default:
      return isGrey ? { bg: '#F4F4F4', fg: '#111827', border: '#E5E5E5' } : { bg: 'rgba(2,6,23,0.06)', fg: '#111827', border: 'rgba(2,6,23,0.12)' };
  }
}

const st = StyleSheet.create({
  page: { flex: 1 },

  // Search row
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth, borderRadius: 12 },
  searchInput: { flex: 1, paddingVertical: Platform.OS === 'ios' ? 8 : 4 },

  // Top bars
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, justifyContent: 'space-between' },
  topBarTitle: { fontWeight: '700' },
  iconBtn: { height: 36, width: 36, alignItems: 'center', justifyContent: 'center' },

  // Chat rows
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  avatarWrap: { marginRight: 12 },
  avatar: { height: 42, width: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  onlineDot: { position: 'absolute', right: 2, bottom: 2, height: 10, width: 10, borderRadius: 5, backgroundColor: '#10b981', borderWidth: 2, borderColor: '#fff' },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  chatName: { fontWeight: '700' },
  timeText: { fontSize: 12 },
  chatBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastText: { flex: 1, marginRight: 8, fontSize: 13, },

  badge: { height: 20, minWidth: 20, paddingHorizontal: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  
  // Thread header
  threadTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
  avatarSmall: { height: 30, width: 30, borderRadius: 15, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },

  // Bubbles
  bubble: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, marginBottom: 6 },
  circleItem: { borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 6 },
  typePill: { alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, marginBottom: 6 },
  typePillText: { fontSize: 12, fontWeight: '700' },

  // Input bar
  inputWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: StyleSheet.hairlineWidth },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 8, paddingVertical: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 120 },
  sendBtn: { height: 40, minWidth: 40, borderRadius: 20, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },

  // Compose sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  sheetHandle: { alignSelf: 'center', height: 4, width: 40, borderRadius: 2, marginBottom: 12 },
  sheetTitle: { fontWeight: '700', marginBottom: 8 },
  sheetClose: { marginTop: 12, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  sheetCloseText: { fontWeight: '600' },

  // Chips & Buttons
  chip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 },
  primaryBtn: { marginTop: 10, alignSelf: 'flex-end', backgroundColor: '#0F172A', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999 },
  primaryBtnText: { color: '#FFF', fontWeight: '700' },
  iconCircle: { height: 36, width: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

  // Reply
  replyBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingTop: 8 },
  replyText: { flex: 1, marginRight: 8, fontSize: 12 },

  // Picker
  pickerBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  pickerCard: { width: '86%', borderRadius: 12, padding: 16, borderWidth: StyleSheet.hairlineWidth },
  pickerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
});
