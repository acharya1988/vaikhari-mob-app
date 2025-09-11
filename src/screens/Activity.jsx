// Vaikhari — Activity + Today (Stories) — Viral UX Revamp
// -------------------------------------------------------------
// Mobile-first, orientation-aware, international-ready, no backend.
// Pure React Native (Expo-friendly). Uses @expo/vector-icons (FA5).
// Drop into: src/screens/ActivityViralToday.jsx (or .tsx with types)
// -------------------------------------------------------------

import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Modal,
  SafeAreaView,
  Platform,
  RefreshControl,
  useWindowDimensions,
  Appearance,
} from 'react-native';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import ContextBottomBar from '../components/ContextBottomBar';
import { useThemeMode } from '../theme/ThemeProvider';

// -------------------------------------------------------------
// THEME (auto light/dark + tokens)
// -------------------------------------------------------------
const palette = {
  light: {
    bg: '#FFFFFF',
    bgMuted: '#F7F7F7',
    text: '#0F172A',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    primary: '#0F172A',
    card: '#FFFFFF',
    chipBG: '#FFFFFF',
  },
  dark: {
    bg: '#0B0F17',
    bgMuted: '#0F1522',
    text: '#E5E7EB',
    textMuted: '#9CA3AF',
    border: '#1F2937',
    primary: '#E5E7EB',
    card: '#0E1420',
    chipBG: '#0B0F17',
  },
  grey: {
    bg: '#F5F5F5',
    bgMuted: '#EFEFEF',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    primary: '#111827',
    card: '#FFFFFF',
    chipBG: '#FFFFFF',
  },
};

const useTheme = () => {
  const { mode } = useThemeMode();
  if (mode === 'dark') return palette.dark;
  if (mode === 'grey') return palette.grey;
  return palette.light;
};

// -------------------------------------------------------------
// Mock Data (replace with API)
// -------------------------------------------------------------
const sampleFeed = [
  {
    id: 'p1',
    author: 'Kalpatantra Vaidya Gurukula',
    handle: '@kalpatantra',
    time: '2h',
    title: 'Aṣṭāṅga Hṛdaya – Sutrasthāna #1',
    content:
      'Opening discussion on Hita–Ahita and Sukha–Dukha in daily regimen. Share your notes from clinical observation.',
    tags: ['Sutra', 'Dinacharya'],
    likes: 128,
    comments: 32,
  },
  {
    id: 'p2',
    author: 'Vaikhari Library',
    handle: '@vaikhari',
    time: '6h',
    content:
      'New annotated edition of Aṣṭāṅga Hṛdaya added. Includes verse‑wise commentary and cross‑links to Śārīra.',
    tags: ['Library', 'Announcement'],
    likes: 76,
    comments: 11,
  },
];

const myPosts = [
  {
    id: 'm1',
    author: 'You',
    handle: '@acharya',
    time: '1d',
    title: 'On Viruddhāhāra pairs',
    content: 'Quick matrix of food incompatibilities I use in OPDO diet sheets.',
    tags: ['Diet', 'Viruddha'],
    likes: 44,
    comments: 9,
  },
];

const circleFeed = [
  {
    id: 'c1',
    author: 'Sanskrit Study Circle',
    handle: '@samskrita',
    time: '4h',
    content:
      'Pāṇinian sandhi drill tomorrow 7PM. Bring your notes on savarṇa dīrgha.',
    circle: 'Sanskrit Study Circle',
    tags: ['Sanskrit', 'Event'],
    likes: 33,
    comments: 6,
  },
];

const chintanaThreads = [
  {
    id: 't1',
    author: 'Dr. Uma',
    time: '3h',
    claim:
      'Is tridoṣa sama truly the baseline of health, or should prakṛti‑specific bias be treated as “normal”?',
    tags: ['Chintana', 'Doṣa'],
    replies: 21,
    stance: 'Prashna',
  },
  {
    id: 't2',
    author: 'Dr. Priya',
    time: '1d',
    claim:
      'For Āma‑dominant jvara, is langhana without dīpana a therapeutically weaker first step?',
    tags: ['Jvara', 'Langhana'],
    replies: 12,
    stance: 'Purva Paksha',
  },
];

const highlights = [
  { id: 'h1', title: 'Live: Śloka Jam', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640' },
  { id: 'h2', title: 'OPDO Diet Lab', img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=640' },
  { id: 'h3', title: 'GranthaDNA Map', img: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=640' },
];

const suggested = [
  { id: 's1', title: 'Follow: Āyurveda Research', handle: '@ayuresearch' },
  { id: 's2', title: 'Join: Chintana Fridays', handle: '@chintana' },
];

const trendingTags = ['#Ayurveda', '#Sanskrit', '#Dinacharya', '#Diet', '#CaseNotes'];

// Today stories (story system)
const todayStories = [
  { id: 'st0', me: true, title: 'Add story', img: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=256' },
  { id: 'st1', title: 'Kalpatantra', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256' },
  { id: 'st2', title: 'Vaikhari', img: 'https://images.unsplash.com/photo-1517512006864-7edc3b933137?w=256' },
  { id: 'st3', title: 'Sanskrit Circle', img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=256' },
];

// Recently announced books (department)
const recentBooks = [
  { id: 'b1', title: 'Rasaśāstra Notes', dept: 'Kayachikitsa', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=640' },
  { id: 'b2', title: 'Sūtra Digest 2025', dept: 'Samhita', img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?w=640' },
  { id: 'b3', title: 'Herb Atlas Vol. 2', dept: 'Dravyaguna', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640' },
];

const TAB_KEYS = ['feed', 'myposts', 'circle', 'chintana'];
const tabMeta = {
  feed: { label: 'Feed', icon: 'globe' },
  myposts: { label: 'My Posts', icon: 'pen' },
  circle: { label: 'Circles', icon: 'users' },
  chintana: { label: 'Chintana', icon: 'comment-dots' },
};

// -------------------------------------------------------------
// UI primitives
// -------------------------------------------------------------
function Badge({ children, variant = 'outline', theme }) {
  return (
    <View
      style={[
        styles.badge,
        { borderColor: theme.border },
        variant === 'secondary' && { backgroundColor: theme.bgMuted },
      ]}
    >
      <Text style={[styles.badgeText, { color: theme.text }]}>{children}</Text>
    </View>
  );
}

function IconButton({ onPress, children, ariaLabel, theme }) {
  return (
    <TouchableOpacity
      accessibilityLabel={ariaLabel}
      style={[styles.iconBtn, { backgroundColor: 'transparent' }]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

function Chip({ children, theme }) {
  return (
    <View style={[styles.chip, { borderColor: theme.border, backgroundColor: theme.chipBG }]}>
      <Text style={[styles.chipText, { color: theme.text }]}>{children}</Text>
    </View>
  );
}

function TodayStories({ theme, onPressStory }) {
  return (
    <View style={styles.storiesWrap}>
      <Text style={[styles.sectionTitle, { color: theme.text, paddingHorizontal: 4 }]}>Today</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.storiesRow]}> 
        {todayStories.map((s, idx) => (
          <TouchableOpacity key={s.id} style={styles.story} onPress={() => onPressStory?.(idx)}>
            <View style={[styles.storyRing, s.me && styles.storyAddRing]}> 
              <Image source={{ uri: s.img }} style={styles.storyImg} />
            </View>
            <Text style={[styles.storyLabel, { color: theme.text }]} numberOfLines={1}>{s.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function BooksCarousel({ theme }) {
  return (
    <View style={{ paddingTop: 8 }}>
      <Text style={[styles.sectionTitle, { color: theme.text, paddingHorizontal: 4 }]}>Latest releases</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingRight: 12, paddingLeft: 4, gap: 12 }}>
        {recentBooks.map((b) => (
          <TouchableOpacity key={b.id} style={[styles.bookCard, { borderColor: theme.border, backgroundColor: theme.card }]}> 
            <Image source={{ uri: b.img }} style={styles.bookImg} />
            <View style={{ padding: 8 }}>
              <Text style={{ color: theme.text, fontWeight: '700' }} numberOfLines={1}>{b.title}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12 }} numberOfLines={1}>{b.dept}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function MobileHeader({ onSearch, theme, onOpenCompose }) {
  const [value, setValue] = useState('');
  return (
    <View style={[styles.headerWrap, { borderColor: theme.border, backgroundColor: theme.bg }]}> 
      <SafeAreaView />
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>Vaikhari</Text>
        <Badge variant="secondary" theme={theme}>Activity</Badge>
        <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
          <IconButton ariaLabel="Search" theme={theme}>
            <FA name="search" size={20} color={theme.text} />
          </IconButton>
          <IconButton ariaLabel="Compose" theme={theme} onPress={onOpenCompose}>
            <FA name="plus" size={20} color={theme.text} />
          </IconButton>
        </View>
      </View>

      {/* Search + Filter on same row */}
      <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TextInput
          placeholder="Search posts, circles, threads…"
          placeholderTextColor={theme.textMuted}
          style={[styles.searchInput, { flex: 1, borderColor: theme.border, backgroundColor: theme.bgMuted, color: theme.text }]}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={() => onSearch(value)}
          returnKeyType="search"
        />
      </View>

          {/* Stories below tags */}
      <TodayStories theme={theme} />

      {/* Books carousel below stories */}
      <BooksCarousel theme={theme} />
    </View>
  );
}

function TabBar({ value, onChange, theme }) {
  return (
    <View style={[styles.tabBarWrap, { borderColor: theme.border, backgroundColor: theme.bg }]}> 
      <View style={styles.tabList}>
        {TAB_KEYS.map((k) => {
          const active = value === k;
          const iconName = tabMeta[k].icon;
          return (
            <TouchableOpacity
              key={k}
              style={[styles.tabBtn, { backgroundColor: active ? theme.primary : theme.bgMuted }]}
              onPress={() => onChange(k)}
            >
              <FA name={iconName} size={16} color={active ? palette.light.bg : theme.textMuted} />
              <Text style={[styles.tabLabel, { color: active ? palette.light.bg : theme.text }]}>{tabMeta[k].label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function FeedCard({ post, theme, onShare }) {
  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}> 
      <View style={styles.cardHeaderRow}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}> 
          {post.avatar ? (
            <Image source={{ uri: post.avatar }} style={styles.avatarImg} />
          ) : (
            <Text style={[styles.avatarFallback, { color: palette.light.bg }]}>{post.author.slice(0, 2).toUpperCase()}</Text>
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={[styles.author, { color: theme.text }]}>{post.author}</Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>{(post.handle ?? '@vaikhari') + ' · ' + post.time}</Text>
        </View>
        {post.circle ? <Badge variant="secondary" theme={theme}>{post.circle}</Badge> : null}
      </View>

      <View style={{ marginTop: 4 }}>
        {post.title ? <Text style={[styles.cardTitle, { color: theme.text }]}>{post.title}</Text> : null}
        <Text style={[styles.cardBody, { color: theme.text }]}>{post.content}</Text>
        {post.tags?.length ? (
          <View style={styles.tagsRow}>
            {post.tags.map((t) => (
              <Chip key={t} theme={theme}>#{t}</Chip>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <FA name="thumbs-up" size={16} color={theme.textMuted} />
          <Text style={[styles.actionText, { color: theme.text }]}>{post.likes ?? 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <FA name="comment-alt" size={16} color={theme.textMuted} />
          <Text style={[styles.actionText, { color: theme.text }]}>{post.comments ?? 0}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.actionBtn} onPress={() => onShare?.(post)}>
          <FA name="share" size={16} color={theme.textMuted} />
          <Text style={[styles.actionText, { color: theme.text }]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}><FA name="bookmark" size={16} color={theme.textMuted} /></TouchableOpacity>
      </View>
    </View>
  );
}

function ThreadCard({ t, theme }) {
  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card }]}> 
      <View style={styles.cardHeaderRow}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}> 
          {t.avatar ? (
            <Image source={{ uri: t.avatar }} style={styles.avatarImg} />
          ) : (
            <Text style={[styles.avatarFallback, { color: palette.light.bg }]}>{t.author.slice(0, 2).toUpperCase()}</Text>
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={[styles.author, { color: theme.text }]}>{t.author}</Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>{(t.stance ?? 'Chintana') + ' · ' + t.time}</Text>
        </View>
        <Badge theme={theme}>Chintana</Badge>
      </View>

      <View style={{ marginTop: 4 }}>
        <Text style={[styles.cardBody, { color: theme.text }]}>{t.claim}</Text>
        {t.tags?.length ? (
          <View style={styles.tagsRow}>
            {t.tags.map((tg) => (
              <Chip key={tg} theme={theme}>#{tg}</Chip>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.actionBtn}><FA name="comment-alt" size={16} color={theme.textMuted} /><Text style={[styles.actionText, { color: theme.text }]}>{t.replies ?? 0}</Text></View>
        <View style={styles.actionBtn}><FA name="fire" size={16} color={theme.textMuted} /><Text style={[styles.actionText, { color: theme.text }]}>Active</Text></View>
      </View>
    </View>
  );
}

function EmptyState({ title, subtitle, theme, cta }) {
  return (
    <View style={[styles.emptyCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <View style={[styles.emptyIcon, { borderColor: theme.border }]}><FA name="bolt" size={20} color={theme.text} /></View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
      {!!cta && (
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
          <Text style={[styles.primaryBtnText, { color: palette.light.bg }]}>{cta}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function Highlights({ theme }) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Highlights</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, gap: 10, paddingRight: 12 }}>
        {highlights.map((h) => (
          <TouchableOpacity key={h.id} style={[styles.highlightCard, { borderColor: theme.border }]}> 
            <Image source={{ uri: h.img }} style={styles.highlightImg} />
            <Text style={[styles.highlightText, { color: palette.light.bg }]} numberOfLines={1}>{h.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function Suggestions({ theme }) {
  return (
    <View style={{ paddingTop: 8 }}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Suggested</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {suggested.map((s) => (
          <View key={s.id} style={[styles.suggestCard, { borderColor: theme.border, backgroundColor: theme.card }]}> 
            <Text style={{ color: theme.text, fontWeight: '600' }}>{s.title}</Text>
            <Text style={{ color: theme.textMuted, marginTop: 2 }}>{s.handle}</Text>
            <TouchableOpacity style={[styles.followBtn, { backgroundColor: theme.primary }]}>
              <Text style={{ color: palette.light.bg, fontWeight: '700' }}>Follow</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

function ListHeader({ theme, onPressStory }) {
  return (
    <View style={{ paddingHorizontal: 12 }}>
      <TodayStories theme={theme} onPressStory={onPressStory} />
      {/* Replace Highlights with Latest Releases carousel */}
      <BooksCarousel theme={theme} />
      <Suggestions theme={theme} />
    </View>
  );
}

// -------------------------------------------------------------
// Compose Tiles (context-aware)
// -------------------------------------------------------------
function ComposeTileRN({ icon, title, theme }) {
  return (
    <TouchableOpacity style={[styles.composeTile, { borderColor: theme.border }]}> 
      <View style={{ marginRight: 10 }}>{icon}</View>
      <Text style={{ fontWeight: '600', color: theme.text }}>{title}</Text>
    </TouchableOpacity>
  );
}

function ComposeTiles({ tab, theme }) {
  // Two sets: A (post types) and B (śāstrīya modes)
  const [setKey, setSetKey] = useState('A');
  const SetToggle = () => (
    <View style={styles.toggleWrap}>
      <TouchableOpacity onPress={() => setSetKey('A')} style={[styles.toggleBtn, setKey==='A' && [styles.toggleActive]]}>
        <Text style={[styles.toggleText, setKey==='A' && styles.toggleTextActive]}>Post Types</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSetKey('B')} style={[styles.toggleBtn, setKey==='B' && [styles.toggleActive]]}>
        <Text style={[styles.toggleText, setKey==='B' && styles.toggleTextActive]}>Śāstrīya Modes</Text>
      </TouchableOpacity>
    </View>
  );

  const PostSet = () => (
    <>
      <ComposeTileRN icon={<FA name="lightbulb" size={18} color={theme.text} />} title="Thought" theme={theme} />
      <ComposeTileRN icon={<FA name="stream" size={18} color={theme.text} />} title="Reflection" theme={theme} />
      <ComposeTileRN icon={<FA name="feather-alt" size={18} color={theme.text} />} title="Poem" theme={theme} />
      <ComposeTileRN icon={<FA name="book" size={18} color={theme.text} />} title="Sutra" theme={theme} />
      <ComposeTileRN icon={<FA name="bullhorn" size={18} color={theme.text} />} title="Announce Book" theme={theme} />
    </>
  );

  const ShastriyaSet = () => (
    <>
      <ComposeTileRN icon={<FA name="balance-scale" size={18} color={theme.text} />} title="Purva Paksha" theme={theme} />
      <ComposeTileRN icon={<FA name="gavel" size={18} color={theme.text} />} title="Uttara Paksha" theme={theme} />
      <ComposeTileRN icon={<FA name="question" size={18} color={theme.text} />} title="Question" theme={theme} />
      <ComposeTileRN icon={<FA name="check-circle" size={18} color={theme.text} />} title="Siddhanta" theme={theme} />
    </>
  );

  // Logic by tab
  if (tab === 'feed' || tab === 'myposts') {
    return <PostSet />; // Wall and My Posts: standard set
  }
  if (tab === 'circle') {
    return (
      <>
        <SetToggle />
        {setKey === 'A' ? <PostSet /> : <ShastriyaSet />}
      </>
    );
  }
  // Chintana focus: Quora-like + śāstrīya
  return (
    <>
      <ComposeTileRN icon={<FA name="question-circle" size={18} color={theme.text} />} title="Ask a Question" theme={theme} />
      <ShastriyaSet />
    </>
  );
}

// -------------------------------------------------------------
// Main Screen
// -------------------------------------------------------------
export default function VaikhariActivityViralTodayScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState('feed');
  const [query, setQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataset] = useState({ feed: sampleFeed, my: myPosts, circle: circleFeed, threads: chintanaThreads });
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Story viewer state
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyLikes, setStoryLikes] = useState({}); // id -> +1/-1/0
  const [commentsByStory, setCommentsByStory] = useState({}); // id -> [{id,text}]
  const [commentsOpen, setCommentsOpen] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = (arr) => (q ? arr.filter((p) => `${p.title ?? ''} ${p.content ?? ''} ${p.author ?? ''}`.toLowerCase().includes(q)) : arr);
    return {
      feed: f(dataset.feed),
      my: f(dataset.my),
      circle: f(dataset.circle),
      threads: q ? dataset.threads.filter((t) => `${t.claim} ${t.author}`.toLowerCase().includes(q)) : dataset.threads,
    };
  }, [query, dataset]);

  const renderFeedItem = ({ item }) => (
    <FeedCard post={item} theme={theme} onShare={() => {}} />
  );
  const renderThreadItem = ({ item }) => <ThreadCard t={item} theme={theme} />;

  const renderContent = () => {
    if (tab === 'feed') {
      return (
        <FlatList
          data={filtered.feed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderFeedItem}
          ListHeaderComponent={<ListHeader theme={theme} onPressStory={(idx) => { setStoryIndex(idx); setStoryOpen(true); }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
        />
      );
    }
    if (tab === 'myposts') {
      return filtered.my.length ? (
        <FlatList
          data={filtered.my}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          renderItem={renderFeedItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
        />
      ) : (
        <View style={styles.list}>
          <EmptyState title={"You haven't posted yet"} subtitle={'Share a note, quote, or case insight.'} theme={theme} cta={'Create your first post'} />
        </View>
      );
    }
    if (tab === 'circle') {
      return filtered.circle.length ? (
        <FlatList
          data={filtered.circle}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          renderItem={renderFeedItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
        />
      ) : (
        <View style={styles.list}><EmptyState title={'No circle activity'} subtitle={'Join circles to populate your feed.'} theme={theme} /></View>
      );
    }
    return filtered.threads.length ? (
      <FlatList
        data={filtered.threads}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={renderThreadItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
      />
    ) : (
      <View style={styles.list}><EmptyState title={'No threads yet'} subtitle={'Start a structured debate in Chintana.'} theme={theme} /></View>
    );
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.bg }]}> 
      <AppHeader />

      {/* Orientation-aware container (adds padding for landscape) */}
      <View style={{ flex: 1, paddingHorizontal: isLandscape ? 12 : 0 }}>{renderContent()}</View>

      {/* Contextual bottom bar for Activity */}
      <ContextBottomBar
        items={[
          { key: 'feed', icon: 'rss' },
          { key: 'myposts', icon: 'user' },
          { key: 'circle', icon: 'users' },
          { key: 'chintana', icon: 'comments' },
        ]}
        value={tab}
        onChange={setTab}
        onFab={() => setComposeOpen(true)}
      />

      {/* Compose Bottom Sheet (Modal) */}
      <Modal visible={composeOpen} transparent animationType="slide" onRequestClose={() => setComposeOpen(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={[styles.sheet, { backgroundColor: theme.card }]}> 
            <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Compose</Text>
            <View style={styles.sheetGrid}>
              <ComposeTiles tab={tab} theme={theme} />
            </View>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setComposeOpen(false)}>
              <Text style={[styles.sheetCloseText, { color: theme.text }]}>{'Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Story Viewer Modal */}
      <StoryViewerModal
        visible={storyOpen}
        initialIndex={storyIndex}
        stories={todayStories}
        theme={theme}
        likes={storyLikes}
        comments={commentsByStory}
        onClose={() => setStoryOpen(false)}
        onLike={(id) => setStoryLikes((m) => ({ ...m, [id]: (m[id] === 1 ? 0 : 1) }))}
        onDislike={(id) => setStoryLikes((m) => ({ ...m, [id]: (m[id] === -1 ? 0 : -1) }))}
        onDrift={(id) => {
          // Placeholder: could navigate to compose with attribution
          setComposeOpen(true);
        }}
        onOpenComments={(id) => {
          setStoryOpen(true);
          setCommentsOpen(true);
        }}
      />

      {/* Comments Sheet */}
      <Modal visible={commentsOpen} transparent animationType="slide" onRequestClose={() => setCommentsOpen(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={[styles.sheet, { backgroundColor: theme.card }]}> 
            <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Comments</Text>
            <CommentsList
              theme={theme}
              story={todayStories[storyIndex]}
              comments={commentsByStory[todayStories[storyIndex]?.id] || []}
              onAdd={(text) => {
                const sid = todayStories[storyIndex]?.id;
                if (!sid || !text.trim()) return;
                setCommentsByStory((m) => ({
                  ...m,
                  [sid]: [...(m[sid] || []), { id: Date.now().toString(), text: text.trim() }],
                }));
              }}
            />
            <TouchableOpacity style={styles.sheetClose} onPress={() => setCommentsOpen(false)}>
              <Text style={[styles.sheetCloseText, { color: theme.text }]}>{'Close'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// -------------------------------------------------------------
// Story Viewer (simple, vertical paging)
// -------------------------------------------------------------
function StoryViewerModal({ visible, initialIndex = 0, stories, theme, onClose, onLike, onDislike, onDrift, onOpenComments, likes, comments }) {
  const { height } = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);

  React.useEffect(() => {
    if (visible) setIndex(initialIndex);
  }, [visible, initialIndex]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.viewerBackdrop, { backgroundColor: 'rgba(0,0,0,0.95)' }]}>
        <FlatList
          data={stories}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: item.img }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
              <View style={[styles.viewerOverlay, { backgroundColor: 'rgba(0,0,0,0.25)' }]} />
              <View style={styles.viewerHeader}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>{item.title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.viewerClose}><FA name="times" size={18} color="#fff" /></TouchableOpacity>
              </View>
              <View style={styles.viewerActions}>
                <TouchableOpacity style={styles.viewerActionBtn} onPress={() => onLike(item.id)}>
                  <FA name="thumbs-up" size={18} color={likes?.[item.id] === 1 ? '#22C55E' : '#fff'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewerActionBtn} onPress={() => onDislike(item.id)}>
                  <FA name="thumbs-down" size={18} color={likes?.[item.id] === -1 ? '#EF4444' : '#fff'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewerActionBtn} onPress={() => onDrift(item.id)}>
                  <FA name="feather" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewerActionBtn} onPress={() => onOpenComments(item.id)}>
                  <FA name="comment" size={18} color="#fff" />
                  <Text style={{ color: '#fff', marginTop: 4, fontSize: 12 }}>
                    {(comments?.[item.id]?.length || 0).toString()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          initialScrollIndex={initialIndex}
          onScrollToIndexFailed={() => {}}
          pagingEnabled
          snapToInterval={height}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
          onMomentumScrollEnd={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            const next = Math.round(y / height);
            setIndex(next);
          }}
        />
      </View>
    </Modal>
  );
}

function CommentsList({ theme, story, comments, onAdd }) {
  const [text, setText] = useState('');
  return (
    <View>
      <Text style={{ color: theme.text, marginBottom: 8 }}>{story?.title}</Text>
      <View style={{ maxHeight: 260 }}>
        <ScrollView>
          {(comments || []).map((c) => (
            <View key={c.id} style={{ paddingVertical: 8 }}>
              <Text style={{ color: theme.text }}>{c.text}</Text>
            </View>
          ))}
          {(!comments || comments.length === 0) && (
            <Text style={{ color: theme.textMuted }}>No comments yet. Be the first to comment.</Text>
          )}
        </ScrollView>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <TextInput
          placeholder="Add a comment"
          placeholderTextColor={theme.textMuted}
          value={text}
          onChangeText={setText}
          style={[styles.searchInput, { flex: 1, borderColor: theme.border, backgroundColor: theme.bgMuted, color: theme.text }]}
        />
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
          onPress={() => { if (text.trim()) { onAdd(text); setText(''); } }}
        >
          <Text style={[styles.primaryBtnText, { color: palette.light.bg }]}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// -------------------------------------------------------------
// Styles
// -------------------------------------------------------------
const styles = StyleSheet.create({
  page: { flex: 1 },
  headerWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: Platform.select({ ios: 6, android: 6, default: 6 }),
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700' },
  iconBtn: { height: 36, width: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  searchInput: { height: 40, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1 },

  // Today Stories
  storiesWrap: { paddingTop: 10 },
  storiesRow: { paddingVertical: 6, paddingRight: 12 },
  story: { width: 70, alignItems: 'center', marginRight: 10 },
  storyRing: { height: 56, width: 56, borderRadius: 28, borderWidth: 2, borderColor: '#FF7A59', alignItems: 'center', justifyContent: 'center' },
  storyImg: { height: 50, width: 50, borderRadius: 25 },
  storyAddRing: { borderColor: '#22C55E' },
  storyLabel: { marginTop: 6, fontSize: 11, fontWeight: '600' },

  tabBarWrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  tabList: { flexDirection: 'row', padding: 8 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, marginHorizontal: 4, borderRadius: 16 },
  tabLabel: { fontSize: 13, fontWeight: '600' },

  list: { padding: 12, gap: 12, paddingBottom: 140 },
  card: { borderWidth: 1, borderRadius: 16, padding: 12 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { height: 36, width: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarImg: { height: 36, width: 36, borderRadius: 18 },
  avatarFallback: { fontWeight: '700' },
  author: { fontWeight: '700' },
  meta: { fontSize: 12 },
  cardTitle: { fontWeight: '700', marginTop: 4 },
  cardBody: { opacity: 0.95, lineHeight: 20 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
  chipText: { fontSize: 12 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 13 },

  emptyCard: { alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 16, padding: 24, margin: 12 },
  emptyIcon: { borderWidth: 1, padding: 8, borderRadius: 999 },
  emptyTitle: { fontWeight: '700' },
  emptySubtitle: { textAlign: 'center' },
  primaryBtn: { marginTop: 8, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999 },
  primaryBtnText: { fontWeight: '700' },

  fabWrap: { position: 'absolute', left: 0, right: 0, bottom: 12 },
  fabInner: { alignSelf: 'center', width: '100%', paddingHorizontal: 12 },
  fab: { height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  fabText: { fontWeight: '700', fontSize: 16 },

  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 12 },

  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  sheetHandle: { alignSelf: 'center', height: 4, width: 40, borderRadius: 2, marginBottom: 10 },
  sheetTitle: { fontWeight: '700', marginBottom: 10 },
  sheetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sheetClose: { marginTop: 12, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  sheetCloseText: { fontWeight: '600' },

  // Compose sheet toggle
  toggleWrap: { flexDirection: 'row', gap: 6, marginBottom: 8, width: '100%' },
  toggleBtn: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 8, borderRadius: 999, alignItems: 'center' },
  toggleActive: { backgroundColor: '#0F172A' },
  toggleText: { fontWeight: '600', color: '#111' },
  toggleTextActive: { color: '#fff' },

  sectionTitle: { fontSize: 14, fontWeight: '700', paddingHorizontal: 4 },
  highlightCard: { width: 140, height: 84, borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  highlightImg: { width: '100%', height: '100%', borderRadius: 12 },
  highlightText: { position: 'absolute', bottom: 6, left: 8, right: 8, fontWeight: '700' },
  suggestCard: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12, minWidth: 140 },
  followBtn: { marginTop: 10, alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },

  // Book carousel
  bookCard: { width: 160, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  bookImg: { width: '100%', height: 120 },

  // Compose tile
  composeTile: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1, borderRadius: 12, minWidth: 140 },

  // Story viewer
  viewerBackdrop: { flex: 1 },
  viewerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  viewerHeader: { position: 'absolute', top: 40, left: 16, right: 16, flexDirection: 'row', alignItems: 'center' },
  viewerClose: { marginLeft: 'auto', height: 36, width: 36, alignItems: 'center', justifyContent: 'center' },
  viewerActions: { position: 'absolute', right: 16, bottom: 40, alignItems: 'center', gap: 16 },
  viewerActionBtn: { height: 44, width: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)' },
});

// -------------------------------------------------------------
// Lightweight runtime checks (DEV only) — serves as simple tests
// -------------------------------------------------------------
export const __tests__ = {
  hasTabs: () => TAB_KEYS.length === 4,
  storiesCount: () => todayStories.length >= 1,
  booksCount: () => recentBooks.length >= 1,
  dataShapes: () => Array.isArray(sampleFeed) && Array.isArray(myPosts) && Array.isArray(circleFeed) && Array.isArray(chintanaThreads),
};



