import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { useThemeMode } from '../theme/ThemeProvider';

/* ----------------------------- Utilities ----------------------------- */
const PRIMARY = '#0F172A';

function Pill({ children, colors, style }) {
  return (
    <View
      style={[
        {
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
        style,
      ]}
    >
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
        {children}
      </Text>
    </View>
  );
}

function SectionTitle({ colors, title, right }) {
  return (
    <View style={{ marginTop: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: colors.text, fontWeight: '800', fontSize: 14 }}>{title}</Text>
      {right}
    </View>
  );
}

function Stars({ colors, value = 0, outOf = 5, size = 14 }) {
  const rounded = Math.round(value * 2) / 2;
  const stars = [];
  for (let i = 1; i <= outOf; i++) {
    const full = rounded >= i;
    const half = !full && rounded + 0.5 >= i;
    stars.push(
      <FA
        key={i}
        name={half ? 'star-half-alt' : 'star'}
        size={size}
        solid
        color={full || half ? PRIMARY : '#9AA5B1'}
        style={{ marginRight: 2 }}
      />
    );
  }
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
}

function MetaRow({ label, value, colors }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
      <Text style={{ color: '#6B7682', fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 12, maxWidth: '65%', textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

function TocTree({ nodes = [], colors }) {
  if (!nodes?.length) {
    return <Text style={{ color: '#6B7682', fontSize: 12 }}>No table of contents available.</Text>;
  }
  return (
    <View style={{ gap: 6 }}>
      {nodes.map((n) => (
        <View key={n.id} style={{}}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <View style={{ marginTop: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: '#9AA5B1' }} />
            <Text style={{ color: colors.text, fontSize: 13 }}>{n.title}</Text>
          </View>
          {n.children?.length ? (
            <View style={{ marginLeft: 14, paddingLeft: 10, borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.border, marginTop: 6 }}>
              <TocTree nodes={n.children} colors={colors} />
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function TabBar({ tabs, current, onChange, colors }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
      style={{ marginTop: 16 }}
    >
      {tabs.map((t) => {
        const active = t === current;
        return (
          <TouchableOpacity
            key={t}
            onPress={() => onChange(t)}
            style={[
              {
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
                backgroundColor: active ? PRIMARY : 'transparent',
              },
            ]}
          >
            <Text style={{ color: active ? '#FFF' : colors.text, fontWeight: '700', fontSize: 12 }}>{t}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

/* ------------------------------ Screen ------------------------------ */
export default function BookProfile({ route, navigation }) {
  const { colors } = useThemeMode();

  // If data passed from list page; else use demo
  const incoming = route?.params?.book;
  const book = useMemo(() => incoming ?? demoBook, [incoming]);

  const [tab, setTab] = useState('Overview');
  const tabs = ['Overview', 'TOC', 'Annotations', 'Metadata', 'Related'];

  const onRead = () => {
    // Open the Living Document reader
    navigation?.navigate?.('LivingDocument', { bookId: book.id, title: book.title });
  };
  const onCollect = () => {
    // Plug your API here
    // fetch('/api/library/collect', {...})
  };

  return (
    <SafeAreaView style={[st.page, { backgroundColor: colors.bg }]}>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Banner */}
        <View style={{ paddingHorizontal: 12, paddingTop: 12 }}>
          <View style={[st.banner, { borderColor: colors.border }]}>
            {book.bannerUrl ? (
              <Image source={{ uri: book.bannerUrl }} style={st.bannerImg} />
            ) : (
              <View style={[st.bannerImg, { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ color: colors.text, fontWeight: '800' }}>{book.title}</Text>
              </View>
            )}
            <View style={st.bannerShade} />
          </View>
        </View>

        {/* Profile Card (overlaps banner visually via margin) */}
        <View style={{ paddingHorizontal: 12, marginTop: -28 }}>
          <View style={[st.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Cover */}
            <View style={{ marginRight: 12 }}>
              <View style={[st.coverWrap, { borderColor: colors.border }]}>
                {book.coverUrl ? (
                  <Image source={{ uri: book.coverUrl }} style={st.coverImg} />
                ) : (
                  <View style={[st.coverImg, { backgroundColor: '#E5E7EB', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 8 }]}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#111827' }} numberOfLines={6}>
                      {book.title}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{book.title}</Text>
              {book.subtitle ? (
                <Text style={{ color: '#6B7682', fontSize: 12, marginTop: 2 }}>{book.subtitle}</Text>
              ) : null}

              {Array.isArray(book.contributors) && book.contributors.length ? (
                <Text style={{ color: colors.text, fontSize: 12, marginTop: 6 }}>
                  {book.contributors.map((p) => (p.role ? `${p.name} (${p.role})` : p.name)).join(' · ')}
                </Text>
              ) : null}

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <Stars colors={colors} value={book.rating ?? 0} />
                <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }}>
                  {(book.rating ?? 0).toFixed(1)} ({book.ratingCount ?? 0})
                </Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {book.meta?.language ? <Pill colors={colors}>{book.meta.language}</Pill> : null}
                {book.meta?.script ? <Pill colors={colors}>{book.meta.script}</Pill> : null}
                {book.meta?.edition ? <Pill colors={colors}>{book.meta.edition}</Pill> : null}
                {book.readingTime ? <Pill colors={colors}>⏱ {book.readingTime}</Pill> : null}
                {book.meta?.pages ? <Pill colors={colors}>{book.meta.pages} pages</Pill> : null}
              </View>

              {/* Actions */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity onPress={onRead} style={[st.primaryBtn]}>
                  <Text style={st.primaryBtnText}>Read</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onCollect} style={[st.ghostBtn, { borderColor: colors.border }]}>
                  <Text style={[st.ghostBtnText, { color: colors.text }]}>Add to Shelf</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ paddingHorizontal: 12 }}>
          <TabBar tabs={tabs} current={tab} onChange={setTab} colors={colors} />
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
          {/* Overview */}
          {tab === 'Overview' ? (
            <View>
              <SectionTitle colors={colors} title="About this Book" />
              <Text style={{ color: colors.text, fontSize: 13, lineHeight: 20 }}>
                {book.description}
              </Text>

              {(book.curators?.length || book.collections?.length) ? (
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                  {book.curators?.length ? (
                    <View style={[st.card, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}>
                      <SectionTitle colors={colors} title="Curated by" />
                      <View style={{ gap: 6 }}>
                        {book.curators.map((c) => (
                          <Text key={c.id} style={{ color: colors.text, fontSize: 12 }}>
                            {c.name}{c.role ? ` — ${c.role}` : ''}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ) : null}

                  {book.collections?.length ? (
                    <View style={[st.card, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}>
                      <SectionTitle colors={colors} title="Collections" />
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {book.collections.map((s) => <Pill key={s} colors={colors}>{s}</Pill>)}
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {book.tags?.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {book.tags.map((t) => (
                    <Pill key={t} colors={colors}>#{t}</Pill>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          {/* TOC */}
          {tab === 'TOC' ? (
            <View>
              <SectionTitle colors={colors} title="Table of Contents" />
              <TocTree nodes={book.sections ?? []} colors={colors} />
            </View>
          ) : null}

          {/* Annotations */}
          {tab === 'Annotations' ? (
            <View>
              <SectionTitle
                colors={colors}
                title="Highlights & Notes"
                right={
                  <TouchableOpacity>
                    <Text style={{ color: '#6B7682', fontSize: 12 }}>View all</Text>
                  </TouchableOpacity>
                }
              />
              <View style={{ gap: 8 }}>
                {[1, 2].map((i) => (
                  <View key={i} style={[st.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontSize: 13 }}>
                      “Food is medicine when harmonized with Rutu (season), Desha (place), and Prakruti (constitution).”
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                      <Text style={{ color: '#6B7682', fontSize: 11 }}>Book · p.{10 + i}</Text>
                      <Text style={{ color: '#6B7682', fontSize: 11 }}>by Medhāyu Scholar</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Metadata */}
          {tab === 'Metadata' ? (
            <View>
              <SectionTitle colors={colors} title="Bibliographic Details" />
              <View style={{ gap: 6 }}>
                {Object.entries(book.meta ?? {}).map(([k, v]) => (
                  <View key={k} style={[st.metaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={{ color: '#6B7682', fontSize: 10, textTransform: 'uppercase' }}>{k}</Text>
                    <Text style={{ color: colors.text, fontSize: 12, marginTop: 2 }}>
                      {Array.isArray(v) ? v.join(', ') : String(v)}
                    </Text>
                  </View>
                ))}
              </View>

              {book.links?.length ? (
                <View style={{ marginTop: 12 }}>
                  <SectionTitle colors={colors} title="Links" />
                  <View style={{ gap: 4 }}>
                    {book.links.map((l) => (
                      <Text key={l.href} style={{ color: PRIMARY, fontSize: 12 }}>{'\u2022'} {l.label}</Text>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Related */}
          {tab === 'Related' ? (
            <View>
              <SectionTitle colors={colors} title="Related Books" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {[1,2,3,4].map((i) => (
                  <View key={i} style={[st.related, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={{ width: 100, height: 134, backgroundColor: '#E5E7EB', borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
                    <View style={{ padding: 8 }}>
                      <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }} numberOfLines={2}>
                        Related Title {i}
                      </Text>
                      <Text style={{ color: '#6B7682', fontSize: 11, marginTop: 2 }}>Author Name</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>

        {/* Sidebar-esque Cards (stacked on mobile) */}
        <View style={{ paddingHorizontal: 12, marginTop: 12 }}>
          <View style={[st.sideCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 13 }}>Quick Info</Text>
            <View style={{ marginTop: 8 }}>
              <MetaRow label="Publisher" value={book.meta?.publisher} colors={colors} />
              <MetaRow label="Published" value={book.meta?.publishedOn} colors={colors} />
              <MetaRow label="ISBN-13" value={book.meta?.isbn13} colors={colors} />
              {Array.isArray(book.meta?.categories) && book.meta.categories.length ? (
                <View style={{ marginTop: 6 }}>
                  <Text style={{ color: '#6B7682', fontSize: 12, marginBottom: 6 }}>Categories</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {book.meta.categories.map((c) => <Pill key={c} colors={colors}>{c}</Pill>)}
                  </View>
                </View>
              ) : null}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={[st.sideBtn, { borderColor: colors.border }]}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>Download</Text></TouchableOpacity>
              <TouchableOpacity style={[st.sideBtn, { borderColor: colors.border }]}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>Share</Text></TouchableOpacity>
              <TouchableOpacity style={[st.sideBtn, { borderColor: colors.border }]}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>Report</Text></TouchableOpacity>
              <TouchableOpacity style={[st.sideBtn, { borderColor: colors.border }]}><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>Wishlist</Text></TouchableOpacity>
            </View>
          </View>

          <View style={[st.sideCard, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 10 }]}>
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 13 }}>How to cite</Text>
            <View style={{ marginTop: 8, backgroundColor: '#F2F4F7', borderRadius: 10, padding: 10 }}>
              <Text style={{ color: '#111827', fontSize: 12 }}>
                {(book.contributors?.[0]?.name ?? 'Author')}. {book.title}. {book.meta?.publisher ?? 'Vaikhari'}, {book.meta?.publishedOn ?? 'n.d.'}.
              </Text>
            </View>
            <TouchableOpacity style={[st.primaryBtn, { marginTop: 10 }]} onPress={() => { /* Clipboard */ }}>
              <Text style={st.primaryBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------ Demo Data ------------------------------ */
const demoBook = {
  id: 'osh-0001',
  slug: 'ashtanga-hridaya',
  title: 'Aṣṭāṅga Hṛdaya',
  subtitle: 'A Classical Treatise on Ayurveda',
  description:
    'A foundational text synthesizing the wisdom of the Caraka and Suśruta traditions, offering practical guidance on health, disease, diagnosis, and therapy. This Vaikhari edition aligns verses with curated commentary, cross-links to Chikitsa rules, and seasonal dietetics.',
  bannerUrl: '',
  coverUrl: '',
  gradient: '',
  contributors: [
    { id: 'p1', name: 'Vāgbhaṭa', role: 'Author' },
    { id: 'p2', name: 'Kalpatantra Vaidya Gurukula', role: 'Commentary' },
  ],
  curators: [{ id: 'c1', name: 'Medhāyu Team', role: 'Vaikhari Curator' }],
  links: [
    { label: 'Open in Reader', href: '#' },
    { label: 'Publisher', href: '#' },
  ],
  sections: [
    { id: 's1', title: 'Sūtrasthāna', children: [{ id: 's1-1', title: 'Ayuskāmiya Adhyaya' }, { id: 's1-2', title: 'Dīrghāyu Tantra' }] },
    { id: 's2', title: 'Śārīrasthāna' },
    { id: 's3', title: 'Cikitsāsthāna' },
  ],
  tags: ['Ayurveda', 'Samhita', 'Classical', 'Chikitsa'],
  meta: {
    language: 'Sanskrit',
    script: 'Devanāgarī',
    edition: 'Vaikhari Annotated',
    publisher: 'Kalpatantra · Oshadham',
    publishedOn: '2025',
    isbn13: '978-1-4028-9462-6',
    pages: 624,
    binding: 'Digital',
    categories: ['Ayurveda', 'Shastra'],
  },
  rating: 4.8,
  ratingCount: 218,
  readingTime: '8–12h',
  wordCount: 210000,
  collections: ['Medhāyu · Core Sūtra', 'Gurukula Curriculum'],
};

/* ------------------------------- Styles -------------------------------- */
const st = StyleSheet.create({
  page: { flex: 1 },

  banner: {
    height: 160,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  bannerImg: { width: '100%', height: '100%' },
  bannerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' },

  profileCard: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
  },

  coverWrap: {
    width: 112,
    height: 150,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  coverImg: { width: '100%', height: '100%' },

  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
  },
  metaCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 10,
  },

  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primaryBtnText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  ghostBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  ghostBtnText: { fontWeight: '800', fontSize: 12 },

  sideCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 12,
  },

  related: {
    width: 140,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
