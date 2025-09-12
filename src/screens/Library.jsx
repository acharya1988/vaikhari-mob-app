import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Dimensions,
  Animated, Easing, Platform, ScrollView, Modal
} from 'react-native';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { useThemeMode } from '../theme/ThemeProvider';

/* ------------------ Mock Hierarchy + Data (replace with API) ----------------- */
const HIERARCHY = [
  {
    id: 'g1', name: 'Samhita',
    categories: [
      { id: 'c1', name: 'Sutrasthana', sub: [{ id: 'sc1', name: 'Dina Charya' }, { id: 'sc2', name: 'Ritu Charya' }] },
      { id: 'c2', name: 'Chikitsa',     sub: [{ id: 'sc3', name: 'Prameha' }, { id: 'sc4', name: 'Jvara' }] },
    ]
  },
  {
    id: 'g2', name: 'Rasayana',
    categories: [
      { id: 'c3', name: 'Geriatrics',  sub: [{ id: 'sc5', name: 'Medhya' }, { id: 'sc6', name: 'Ojaskara' }] },
      { id: 'c4', name: 'Rasashastra', sub: [{ id: 'sc7', name: 'Parada' }, { id: 'sc8', name: 'Lauha' }] },
    ]
  },
];

const TYPES = ['all', 'books', 'articles', 'whitepapers', 'abstracts'];
const LANGS = ['all', 'en', 'sa', 'kn'];

const MOCK_ITEMS = Array.from({ length: 40 }).map((_, i) => {
  const genre = i % 2 ? 'g1' : 'g2';
  const cat   = genre === 'g1' ? (i % 3 ? 'c1' : 'c2') : (i % 3 ? 'c3' : 'c4');
  const sub   = { c1: ['sc1','sc2'], c2:['sc3','sc4'], c3:['sc5','sc6'], c4:['sc7','sc8'] }[cat][i % 2];
  return {
    id: 'bk_' + (i + 1),
    title: i % 3 ? `Samhita Notes Vol. ${i + 1}` : `Rasāyana Studies ${i + 1}`,
    author: 'Kalpatantra Vaidya Gurukula',
    year: 2020 + (i % 5),
    language: i % 2 ? 'sa' : 'en',
    subjects: i % 2 ? ['Sutrasthana', 'Research'] : ['Kaya Chikitsa', 'Community'],
    type: i % 5 === 0 ? 'articles' : (i % 4 === 0 ? 'whitepapers' : (i % 6 === 0 ? 'abstracts' : 'books')),
    cover: `https://placehold.co/600x840/png?text=Cover+${i + 1}`,
    collected: i % 4 === 0,
    genreId: genre, categoryId: cat, subCategoryId: sub,
  };
});

/* --------------------------------- Screen ---------------------------------- */
export default function LibraryScreen({ navigation }) {
  const { colors } = useThemeMode();

  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const [lang, setLang] = useState('all');
  const [genre, setGenre] = useState();
  const [category, setCategory] = useState();
  const [subCategory, setSubCategory] = useState();

  const [cols, setCols] = useState(getCols(Dimensions.get('window').width));
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setCols(getCols(window.width)));
    return () => sub?.remove?.();
  }, []);

  const categories = useMemo(() => {
    if (!genre) return [];
    return (HIERARCHY.find(g => g.id === genre)?.categories || []).map(c => ({ id: c.id, name: c.name }));
  }, [genre]);
  const subCategories = useMemo(() => {
    if (!category) return [];
    const g = HIERARCHY.find(g => g.id === genre);
    const c = g?.categories?.find(c => c.id === category);
    return (c?.sub || []).map(s => ({ id: s.id, name: s.name }));
  }, [genre, category]);

  const items = useMemo(() => {
    let data = [...MOCK_ITEMS];
    if (type !== 'all') data = data.filter(d => d.type === type);
    if (lang !== 'all') data = data.filter(d => d.language === lang);
    if (genre) data = data.filter(d => d.genreId === genre);
    if (category) data = data.filter(d => d.categoryId === category);
    if (subCategory) data = data.filter(d => d.subCategoryId === subCategory);

    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.author || '').toLowerCase().includes(q) ||
        (d.subjects || []).join(' ').toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => b.year - a.year);
    return data;
  }, [type, lang, genre, category, subCategory, query]);

  const ITEM_HEIGHT = 176 + 24;
  const columnWrapperStyle = useMemo(() => (cols > 1 ? { gap: 12 } : undefined), [cols]);
  const keyExtractor = useCallback((it) => it.id, []);
  const getItemLayout = useCallback((_, index) => {
    const rows = Math.floor(index / cols);
    const length = ITEM_HEIGHT;
    const offset = rows * (ITEM_HEIGHT + 12);
    return { length, offset, index };
  }, [cols]);

  const onOpenItem = useCallback((item) => {
    navigation?.navigate?.('BookProfile', { id: item.id, title: item.title, cover: item.cover });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }) => <BookCard3D colors={colors} item={item} onOpen={() => onOpenItem(item)} />,
    [colors, onOpenItem]
  );

  const clearFilters = () => {
    setLang('all'); setGenre(undefined); setCategory(undefined); setSubCategory(undefined);
  };

  return (
    <View style={[st.page, { backgroundColor: colors.bg }]}>
      <AppHeader />

      {/* Search + Filter button */}
      <View style={[st.controls, { borderColor: colors.border }]}>
        <View style={[st.searchRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <FA name="search" color="#8A8F98" size={14} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search titles, authors, subjects…"
            placeholderTextColor="#8A8F98"
            style={[st.searchInput, { color: colors.text }]}
          />
          <TouchableOpacity onPress={() => setFilterOpen(true)} style={st.iconCircle}>
            <FA name="filter" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Results */}
      <View style={{ paddingHorizontal: 12, flex: 1 }}>
        <Text style={{ color: '#73808C', fontSize: 12, marginBottom: 8 }}>{items.length} results</Text>
        <FlatList
          data={items}
          key={cols}
          numColumns={cols}
          columnWrapperStyle={columnWrapperStyle}
          contentContainerStyle={{ gap: 12, paddingBottom: 76 }}  // bar height padding
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={7}
          removeClippedSubviews
        />
      </View>

      {/* Bottom Navigation */}
      <LibraryBottomBar
        colors={colors}
        value={type}
        onChange={setType}
        items={[
          { key: 'all',         icon: 'th-large',   label: 'All' },
          { key: 'books',       icon: 'book',       label: 'Books' },
          { key: 'articles',    icon: 'file-alt',   label: 'Articles' },
          { key: 'whitepapers', icon: 'file',       label: 'White papers' },
          { key: 'abstracts',   icon: 'align-left', label: 'Abstracts' },
        ]}
      />

      {/* Filter Sheet */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <View style={st.sheetBackdrop}>
          <View style={[st.sheet, { backgroundColor: colors.card }]}>
            <View style={[st.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[st.sheetTitle, { color: colors.text }]}>Filters</Text>

            {/* Language */}
            <Text style={[st.fieldLabel, { color: colors.text }]}>Language</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {LANGS.map(l => {
                const active = lang === l;
                return (
                  <TouchableOpacity
                    key={l}
                    onPress={() => setLang(l)}
                    style={[st.chip, { borderColor: colors.border, backgroundColor: active ? '#0F172A' : 'transparent' }]}
                  >
                    <Text style={{ color: active ? '#FFF' : colors.text, fontWeight: '700' }}>{l.toUpperCase()}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Genre */}
            <Text style={[st.fieldLabel, { color: colors.text, marginTop: 14 }]}>Genre</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
              <Pill label="All" active={!genre} onPress={() => { setGenre(undefined); setCategory(undefined); setSubCategory(undefined); }} colors={colors} />
              {HIERARCHY.map(g => (
                <Pill key={g.id} label={g.name} active={genre === g.id} onPress={() => { setGenre(g.id); setCategory(undefined); setSubCategory(undefined); }} colors={colors} />
              ))}
            </ScrollView>

            {/* Category */}
            <Text style={[st.fieldLabel, { color: colors.text }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
              <Pill label="All" active={!category} onPress={() => { setCategory(undefined); setSubCategory(undefined); }} colors={colors} disabled={!genre} />
              {categories.map(c => (
                <Pill key={c.id} label={c.name} active={category === c.id} onPress={() => { setCategory(c.id); setSubCategory(undefined); }} colors={colors} disabled={!genre} />
              ))}
            </ScrollView>

            {/* Subcategory */}
            <Text style={[st.fieldLabel, { color: colors.text }]}>Subcategory</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
              <Pill label="All" active={!subCategory} onPress={() => setSubCategory(undefined)} colors={colors} disabled={!category} />
              {subCategories.map(sc => (
                <Pill key={sc.id} label={sc.name} active={subCategory === sc.id} onPress={() => setSubCategory(sc.id)} colors={colors} disabled={!category} />
              ))}
            </ScrollView>

            {/* Actions */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <TouchableOpacity onPress={clearFilters} style={[st.resetBtn, { borderColor: colors.border }]}>
                <Text style={[st.resetText, { color: colors.text }]}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterOpen(false)} style={[st.applyBtn]}>
                <Text style={st.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={st.sheetClose} onPress={() => setFilterOpen(false)}>
              <Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ------------------------------ 3D Book Card ------------------------------- */
const BookCard3D = React.memo(function BookCard3D({ colors, item, onOpen }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const lift   = useRef(new Animated.Value(0)).current;

  const pressIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(rotate, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(lift,   { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [lift, rotate]);

  const pressOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(rotate, { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(lift,   { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [lift, rotate]);

  const rY = rotate.interpolate({ inputRange: [0, 1], outputRange: ['-22deg', '-4deg'] });
  const tY = lift.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const shadow = lift.interpolate({ inputRange: [0, 1], outputRange: [2, 6] });

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onOpen}
      style={[st.card, { borderColor: colors.border, backgroundColor: colors.card }]}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* 3D visual */}
        <View style={st.bookWrap}>
          <Animated.View style={[st.book3d, { transform: [{ perspective: 900 }, { rotateY: rY }, { translateY: tY }], shadowRadius: shadow }]}>
            <Image source={{ uri: item.cover }} style={st.coverImg} />
            <View style={st.spine} />
          </Animated.View>
        </View>

        {/* Meta */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text numberOfLines={2} style={[st.titleText, { color: colors.text }]}>{item.title}</Text>
            <View style={st.badge}><Text style={st.badgeText}>{labelOf(item.type)}</Text></View>
          </View>
          <Text numberOfLines={1} style={{ color: '#73808C', marginTop: 2, fontSize: 12 }}>{item.author}</Text>
          <Text numberOfLines={2} style={{ color: '#8A8F98', marginTop: 8, fontSize: 12 }}>{item.subjects.slice(0, 2).join(' • ') || '—'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

/* ------------------------- Bottom Bar ---------------------- */
function LibraryBottomBar({ colors, value, onChange, items }) {
  return (
    <View style={[lb.wrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={lb.row}>
        {items.map((it) => {
          const active = value === it.key;
          return (
            <TouchableOpacity
              key={it.key}
              onPress={() => onChange(it.key)}
              style={[lb.item, active && lb.itemActive]}
              activeOpacity={0.85}
            >
              <FA name={it.icon} size={16} color={active ? '#FFF' : colors.text} />
              <Text style={[lb.label, { color: active ? '#FFF' : colors.text }]} numberOfLines={1}>
                {it.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ------------------------------- Bits ------------------------------------- */
function Pill({ label, active, onPress, colors, disabled }) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        st.chip,
        {
          borderColor: colors.border,
          backgroundColor: active ? '#0F172A' : 'transparent',
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      <Text style={{ color: active ? '#FFF' : colors.text, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );
}
function getCols(w) { if (w >= 1100) return 3; if (w >= 700) return 2; return 1; }
function labelOf(t) {
  switch (t) {
    case 'books': return 'Book';
    case 'articles': return 'Article';
    case 'whitepapers': return 'White paper';
    case 'abstracts': return 'Abstract';
    default: return 'All';
  }
}

/* ------------------------------- Styles ----------------------------------- */
const st = StyleSheet.create({
  page: { flex: 1 },

  title: { fontSize: 22, fontWeight: '800', letterSpacing: 0.2 },

  controls: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6, borderBottomWidth: StyleSheet.hairlineWidth },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: Platform.OS === 'ios' ? 10 : 6
  },
  searchInput: { flex: 1, paddingVertical: 0 },
  iconCircle: { height: 28, width: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

  card: {
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, padding: 12,
    shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2
  },

  // 3D book visuals
  bookWrap: { width: 122, height: 176, alignItems: 'center', justifyContent: 'center' },
  book3d: {
    width: 122, height: 176, borderRadius: 6, backgroundColor: '#0F172A',
    shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 8 }, shadowRadius: 6, elevation: 4,
  },
  coverImg: { width: '100%', height: '100%', borderRadius: 6 },
  spine: { position: 'absolute', right: -6, top: 6, bottom: 6, width: 10, borderRadius: 2, backgroundColor: '#0C1422', opacity: 0.9 },

  titleText: { flex: 1, fontWeight: '800', fontSize: 14, letterSpacing: 0.2 },
  badge: { backgroundColor: '#0F172A', borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8, marginLeft: 8, alignSelf: 'flex-start' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  chip: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: StyleSheet.hairlineWidth, borderRadius: 999 },

  // Filter sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  sheetHandle: { alignSelf: 'center', height: 4, width: 40, borderRadius: 2, marginBottom: 12 },
  sheetTitle: { fontWeight: '800', marginBottom: 12, fontSize: 16 },

  fieldLabel: { fontWeight: '700', marginTop: 6, marginBottom: 6 },

  resetBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  resetText: { fontWeight: '700' },
  applyBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#0F172A' },
  applyText: { color: '#FFF', fontWeight: '800' },

  sheetClose: { marginTop: 8, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  sheetCloseText: { fontWeight: '600' },
});

const lb = StyleSheet.create({
  wrap: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6,
  },
  item: {
    flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12,
  },
  itemActive: { backgroundColor: '#0F172A' },
  label: { fontSize: 11, fontWeight: '700', marginTop: 4 },
});
