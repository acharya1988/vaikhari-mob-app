import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Platform,
} from "react-native";
import { FontAwesome5 as FA } from '@expo/vector-icons';

// -------------------------------------------------
// Local, dependency-free mono icons for RN
// (avoids bundler issues with lucide-react-native)
// -------------------------------------------------
const makeIcon = (glyph) => ({ size = 16, color = "#111" }) => (
  <Text style={{ fontSize: size, color, includeFontPadding: false, textAlignVertical: "center" }}>{glyph}</Text>
);
const Icons = {
  Search: makeIcon("🔍"),
  Plus: makeIcon("＋"),
  Filter: makeIcon("⚲"),
  ThumbsUp: makeIcon("👍"),
  MessageCircle: makeIcon("💬"),
  Share2: makeIcon("↗"),
  Flame: makeIcon("🔥"),
  Bookmark: makeIcon("🔖"),
  Users: makeIcon("👥"),
  Library: makeIcon("📚"),
  Feather: makeIcon("✒️"),
  MessageSquare: makeIcon("💬"),
  Zap: makeIcon("⚡"),
  ChevronDown: makeIcon("⌄"),
  Globe2: makeIcon("🌐"),
};
const makeFA = (name) => ({ size = 16, color = '#111' }) => (<FA name={name} size={size} color={color} />);
const IconsFA = {
  Search: makeFA('search'),
  Plus: makeFA('plus'),
  Filter: makeFA('filter'),
  ThumbsUp: makeFA('thumbs-up'),
  MessageCircle: makeFA('comment-alt'),
  Share2: makeFA('share'),
  Flame: makeFA('fire'),
  Bookmark: makeFA('bookmark'),
  Users: makeFA('users'),
  Library: makeFA('book'),
  Feather: makeFA('pen'),
  MessageSquare: makeFA('comment-dots'),
  Zap: makeFA('bolt'),
  ChevronDown: makeFA('chevron-down'),
  Globe2: makeFA('globe'),
};
const { Search, Plus, Filter, ThumbsUp, MessageCircle, Share2, Flame, Bookmark, Users, Library, Feather, MessageSquare, Zap, ChevronDown, Globe2 } = IconsFA;

// -------------------------------------------------
// Vaikhari – Activity Page (React Native, JSX)
// Mobile-first UX adapted for native.
// -------------------------------------------------

// Sample data (replace with API calls)
const sampleFeed = [
  {
    id: "p1",
    author: "Kalpatantra Vaidya Gurukula",
    handle: "@kalpatantra",
    time: "2h",
    title: "Aṣṭāṅga Hṛdaya – Sutrasthāna #1",
    content:
      "Opening discussion on Hita–Ahita and Sukha–Dukha in daily regimen. Share your notes from clinical observation.",
    tags: ["Sutra", "Dinacharya"],
    likes: 128,
    comments: 32,
  },
  {
    id: "p2",
    author: "Vaikhari Library",
    handle: "@vaikhari",
    time: "6h",
    content:
      "New annotated edition of Aṣṭāṇga Hṛdaya added. Includes verse‑wise commentary and cross‑links to Ṣārīra.",
    tags: ["Library", "Announcement"],
    likes: 76,
    comments: 11,
  },
];

const myPosts = [
  {
    id: "m1",
    author: "You",
    handle: "@acharya",
    time: "1d",
    title: "On Viruddhāhāra pairs",
    content:
      "Quick matrix of food incompatibilities I use in OPDO diet sheets.",
    tags: ["Diet", "Viruddha"],
    likes: 44,
    comments: 9,
  },
];

const circleFeed = [
  {
    id: "c1",
    author: "Sanskrit Study Circle",
    handle: "@samskrita",
    time: "4h",
    content:
      "Paninian sandhi drill tomorrow 7PM. Bring your notes on savarṇa dīrgha.",
    circle: "Sanskrit Study Circle",
    tags: ["Sanskrit", "Event"],
    likes: 33,
    comments: 6,
  },
];

const chintanaThreads = [
  {
    id: "t1",
    author: "Dr. Uma",
    time: "3h",
    claim:
      "Is tridoṣa sama truly the baseline of health, or should prakṛti‑specific bias be treated as ‘normal’?",
    tags: ["Chintana", "Doṣa"],
    replies: 21,
    stance: "Prashna",
  },
  {
    id: "t2",
    author: "Dr. Priya",
    time: "1d",
    claim:
      "For Āma‑dominant jvara, is langhana without deepana a therapeutically weaker first step?",
    tags: ["Jvara", "Langhana"],
    replies: 12,
    stance: "Purva Paksha",
  },
];

const TAB_KEYS = ["feed", "myposts", "circle", "chintana"];

const tabMeta = {
  feed: { label: "Feed", icon: Globe2 },
  myposts: { label: "My Posts", icon: Feather },
  circle: { label: "Circle Feed", icon: Users },
  chintana: { label: "Chintana", icon: MessageSquare },
};

function Badge({ children, variant = "outline" }) {
  return (
    <View
      style={[
        styles.badge,
        variant === "secondary" && { backgroundColor: "#F2F2F2", borderColor: "#E5E5E5" },
      ]}
    >
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

function IconButton({ onPress, children, ariaLabel }) {
  return (
    <TouchableOpacity accessibilityLabel={ariaLabel} style={styles.iconBtn} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

function Chip({ children }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>#{children}</Text>
    </View>
  );
}

function MobileHeader({ onSearch }) {
  const [value, setValue] = useState("");
  return (
    <View style={styles.headerWrap}>
      <SafeAreaView />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Vaikhari</Text>
        <Badge variant="secondary">Activity</Badge>
        <View style={{ marginLeft: "auto", flexDirection: "row" }}>
          <IconButton ariaLabel="Search"><Search size={20} color="#111" /></IconButton>
          <IconButton ariaLabel="Compose"><Plus size={20} color="#111" /></IconButton>
        </View>
      </View>
      <View style={{ marginTop: 8 }}>
        <TextInput
          placeholder="Search posts, circles, threads…"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={value}
          onChangeText={setValue}
          onSubmitEditing={() => onSearch(value)}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

function TabBar({ value, onChange }) {
  return (
    <View style={styles.tabBarWrap}>
      <View style={styles.tabList}>
        {TAB_KEYS.map((k) => {
          const active = value === k;
          const Icon = tabMeta[k].icon;
          return (
            <TouchableOpacity key={k} style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={() => onChange(k)}>
              <Icon size={16} color={active ? "#fff" : "#555"} />
              <Text style={[styles.tabLabel, active && { color: "#fff", marginLeft: 6 }]}>{tabMeta[k].label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function FilterBar() {
  return (
    <View style={styles.filterBar}>
      <TouchableOpacity style={styles.filterBtn}>
        <Filter size={16} color="#111" />
        <Text style={[styles.filterText, { marginHorizontal: 6 }]}>Filters</Text>
        <ChevronDown size={16} color="#111" />
      </TouchableOpacity>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={[styles.tagBtn, { marginRight: 8 }]}><Text style={styles.tagText}>#Ayurveda</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tagBtn}><Text style={styles.tagText}>#Sanskrit</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function FeedCard({ post }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={[styles.avatar, { marginRight: 10 }]}>
          {post.avatar ? (
            <Image source={{ uri: post.avatar }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarFallback}>{post.author.slice(0, 2).toUpperCase()}</Text>
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={styles.author}>{post.author}</Text>
          <Text style={styles.meta}>{(post.handle || "@vaikhari") + " · " + post.time}</Text>
        </View>
        {post.circle ? <Badge variant="secondary">{post.circle}</Badge> : null}
      </View>

      <View style={{ marginTop: 4 }}>
        {post.title ? <Text style={styles.cardTitle}>{post.title}</Text> : null}
        <Text style={styles.cardBody}>{post.content}</Text>
        {post.tags && post.tags.length ? (
          <View style={styles.tagsRow}>
            {post.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </View>
        ) : null}
      </View>

      <View style={[styles.actionsRow, { marginTop: 10 }]}>
        <TouchableOpacity style={[styles.actionBtn, { marginRight: 12 }]}>
          <ThumbsUp size={16} color="#666" />
          <Text style={[styles.actionText, { marginLeft: 6 }]}>{post.likes != null ? post.likes : 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { marginRight: 12 }]}>
          <MessageCircle size={16} color="#666" />
          <Text style={[styles.actionText, { marginLeft: 6 }]}>{post.comments != null ? post.comments : 0}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={[styles.actionBtn, { marginRight: 12 }]}><Share2 size={16} color="#666" /><Text style={[styles.actionText, { marginLeft: 6 }]}>Share</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}><Bookmark size={16} color="#666" /></TouchableOpacity>
      </View>
    </View>
  );
}

function ThreadCard({ t }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={[styles.avatar, { marginRight: 10 }]}>
          {t.avatar ? (
            <Image source={{ uri: t.avatar }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarFallback}>{t.author.slice(0, 2).toUpperCase()}</Text>
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={styles.author}>{t.author}</Text>
          <Text style={styles.meta}>{(t.stance || "Chintana") + " · " + t.time}</Text>
        </View>
        <Badge>Chintana</Badge>
      </View>

      <View style={{ marginTop: 4 }}>
        <Text style={styles.cardBody}>{t.claim}</Text>
        {t.tags && t.tags.length ? (
          <View style={styles.tagsRow}>
            {t.tags.map((tg) => (
              <Chip key={tg}>{tg}</Chip>
            ))}
          </View>
        ) : null}
      </View>

      <View style={[styles.actionsRow, { marginTop: 10 }]}>
        <View style={[styles.actionBtn, { marginRight: 12 }]}><MessageCircle size={16} color="#666" /><Text style={[styles.actionText, { marginLeft: 6 }]}>{t.replies != null ? t.replies : 0}</Text></View>
        <View style={styles.actionBtn}><Flame size={16} color="#666" /><Text style={[styles.actionText, { marginLeft: 6 }]}>Active</Text></View>
      </View>
    </View>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <View style={styles.emptyCard}>
      <View style={[styles.emptyIcon, { marginBottom: 8 }]}><Zap size={20} color="#111" /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={[styles.emptySubtitle, { marginTop: 4 }]}>{subtitle}</Text>
      <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8 }]}><Text style={styles.primaryBtnText}>Create your first post</Text></TouchableOpacity>
    </View>
  );
}

export default function VaikhariActivityScreen() {
  const [tab, setTab] = useState("feed");
  const [query, setQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = (arr) => (q ? arr.filter((p) => (`${(p.title || "")} ${p.content} ${p.author}`).toLowerCase().includes(q)) : arr);
    return {
      feed: f(sampleFeed),
      my: f(myPosts),
      circle: f(circleFeed),
      threads: q ? chintanaThreads.filter((t) => (`${t.claim} ${t.author}`).toLowerCase().includes(q)) : chintanaThreads,
    };
  }, [query]);

  const renderContent = () => {
    if (tab === "feed") {
      return filtered.feed.length ? (
        <FlatList
          data={filtered.feed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <FeedCard post={item} />}
        />
      ) : (
        <View style={styles.list}><EmptyState title="No posts yet" subtitle="Follow circles and authors to see posts here." /></View>
      );
    }
    if (tab === "myposts") {
      return filtered.my.length ? (
        <FlatList data={filtered.my} keyExtractor={(i) => i.id} contentContainerStyle={styles.list} renderItem={({ item }) => <FeedCard post={item} />} />
      ) : (
        <View style={styles.list}><EmptyState title="You haven't posted yet" subtitle="Share a note, quote, or case insight." /></View>
      );
    }
    if (tab === "circle") {
      return filtered.circle.length ? (
        <FlatList data={filtered.circle} keyExtractor={(i) => i.id} contentContainerStyle={styles.list} renderItem={({ item }) => <FeedCard post={item} />} />
      ) : (
        <View style={styles.list}><EmptyState title="No circle activity" subtitle="Join circles to populate your feed." /></View>
      );
    }
    // chintana
    return filtered.threads.length ? (
      <FlatList data={filtered.threads} keyExtractor={(i) => i.id} contentContainerStyle={styles.list} renderItem={({ item }) => <ThreadCard t={item} />} />
    ) : (
      <View style={styles.list}><EmptyState title="No threads yet" subtitle="Start a structured debate in Chintana." /></View>
    );
  };

  return (
    <View style={styles.page}>
      <MobileHeader onSearch={setQuery} />
      <TabBar value={tab} onChange={setTab} />
      <FilterBar />

      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Floating Action Button */}
      <View style={styles.fabWrap} pointerEvents="box-none">
        <View style={styles.fabInner}>
          <TouchableOpacity style={styles.fab} onPress={() => setComposeOpen(true)}>
            <Plus size={18} color="#fff" />
            <Text style={styles.fabText}>Compose</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Compose Bottom Sheet (Modal based) */}
      <Modal visible={composeOpen} transparent animationType="slide" onRequestClose={() => setComposeOpen(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Compose</Text>
            <View style={styles.sheetGrid}>
              <ComposeTileRN icon={<Feather size={18} color="#111" />} title="Post" />
              <ComposeTileRN icon={<MessageSquare size={18} color="#111" />} title="Chintana" />
              <ComposeTileRN icon={<Users size={18} color="#111" />} title="Circle Post" />
              <ComposeTileRN icon={<Library size={18} color="#111" />} title="Book Note" />
            </View>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setComposeOpen(false)}>
              <Text style={styles.sheetCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DEV sanity checks */}
      {__DEV__ ? (
        <View style={{ position: "absolute", left: -9999 }}>
          <Text>
            {(() => {
              try {
                console.assert(Array.isArray(sampleFeed) && sampleFeed.length > 0, "sampleFeed present");
                const q = "hridaya";
                const hits = sampleFeed.filter((p) => (`${(p.title || "")} ${p.content}`).toLowerCase().includes(q)).length;
                console.assert(hits >= 1, "filtering finds hridaya content");
                console.assert(TAB_KEYS.includes("feed") && TAB_KEYS.includes("chintana"), "tab keys ok");
                return "ok";
              } catch (e) {
                return "dev-test-failed";
              }
            })()}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function ComposeTileRN({ icon, title }) {
  return (
    <TouchableOpacity style={styles.composeTile}>
      <View style={{ marginRight: 10 }}>{icon}</View>
      <Text style={{ fontWeight: "600", color: "#111" }}>{title}</Text>
    </TouchableOpacity>
  );
}

// -------------------------------------------------
// Styles
// -------------------------------------------------
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  headerWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#EAEAEA",
    backgroundColor: "#ffffffCC",
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: Platform.select({ ios: 6, android: 6, default: 6 }),
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", color: "#111" },
  iconBtn: { height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 18 },
  searchInput: {
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
    color: "#111",
  },
  tabBarWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#EAEAEA",
    backgroundColor: "#fff",
  },
  tabList: { flexDirection: "row", padding: 8 },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  tabBtnActive: { backgroundColor: "#111" },
  tabLabel: { fontSize: 13, color: "#555", fontWeight: "600" },

  filterBar: { paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center" },
  filterBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 999 },
  filterText: { fontSize: 13, fontWeight: "600", color: "#111" },
  tagBtn: { borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  tagText: { fontSize: 13, color: "#111" },

  list: { padding: 12 },
  card: { borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 16, padding: 12, backgroundColor: "#fff", marginBottom: 12 },
  cardHeaderRow: { flexDirection: "row", alignItems: "center" },
  avatar: { height: 36, width: 36, borderRadius: 18, backgroundColor: "#111", alignItems: "center", justifyContent: "center" },
  avatarImg: { height: 36, width: 36, borderRadius: 18 },
  avatarFallback: { color: "#fff", fontWeight: "700" },
  author: { fontWeight: "700", color: "#111" },
  meta: { fontSize: 12, color: "#6B7280" },
  cardTitle: { fontWeight: "700", color: "#111", marginTop: 4 },
  cardBody: { color: "#111", opacity: 0.9, lineHeight: 20 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  chip: { borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, backgroundColor: "#fff", marginRight: 8, marginBottom: 8 },
  chipText: { fontSize: 12, color: "#111" },
  actionsRow: { flexDirection: "row", alignItems: "center" },
  actionBtn: { flexDirection: "row", alignItems: "center" },
  actionText: { fontSize: 13, color: "#444" },

  emptyCard: { alignItems: "center", borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 16, padding: 24, margin: 12 },
  emptyIcon: { borderWidth: 1, borderColor: "#E5E5E5", padding: 8, borderRadius: 999 },
  emptyTitle: { fontWeight: "700", color: "#111" },
  emptySubtitle: { color: "#6B7280", textAlign: "center" },
  primaryBtn: { marginTop: 8, backgroundColor: "#111", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999 },
  primaryBtnText: { color: "#fff", fontWeight: "700" },

  fabWrap: { position: "absolute", left: 0, right: 0, bottom: 12 },
  fabInner: { maxWidth: 640, alignSelf: "center", width: "100%", paddingHorizontal: 12 },
  fab: { height: 48, borderRadius: 999, backgroundColor: "#111", alignItems: "center", justifyContent: "center", flexDirection: "row", paddingHorizontal: 16, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 16, marginLeft: 8 },

  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1, borderColor: "#E5E5E5" },
  badgeText: { fontSize: 12, color: "#111" },

  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  sheetHandle: { alignSelf: "center", height: 4, width: 40, borderRadius: 2, backgroundColor: "#E5E5E5", marginBottom: 10 },
  sheetTitle: { fontWeight: "700", color: "#111", marginBottom: 10 },
  sheetGrid: { flexDirection: "row", flexWrap: "wrap" },
  composeTile: { flexBasis: "48%", flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 12, margin: 4 },
  sheetClose: { marginTop: 12, alignSelf: "center", paddingVertical: 8, paddingHorizontal: 16 },
  sheetCloseText: { color: "#111", fontWeight: "600" },
});
