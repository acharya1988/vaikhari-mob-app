import React, { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, SafeAreaView } from 'react-native';
import { Pressable } from 'react-native';
import { FontAwesome5 as FA } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import ContextBottomBar from '../components/ContextBottomBar';
import { useThemeMode } from '../theme/ThemeProvider';

// Living Document Reader (React Native)
// - Pane cycle: 1 => content-only, 2 => content + right panel, 3 => content + notes panel
// - Font size switcher: A+ A A-
// - Navigator: center FAB opens chapter/article navigator
// - Language switcher
// - IntelliCite panel (glossary/bookmarks/quotes/comments)

const DEMO_BOOK = {
  id: 'demo-book-1',
  title: 'Aṣṭāṅga Hṛdaya – Sutrasthāna',
  scripts: ['Devanagari', 'IAST', 'English'],
  chapters: [
    { id: 'ch1', title: 'Chapter 1 — Ayu', articles: [
      { id: 'a1', title: 'Hita–Ahita and Sukha–Dukha', paragraphs: [
        'Ayu is the combination of body, senses, mind, and soul. [[Langhana]] and [[Dīpana]] must be discerned as contextual supports.',
        'Daily routine is framed considering time, place, and one’s constitution. Moderation and regularity play a pivotal role in preserving balance.',
        'Observation and reflection assist the physician in forming workable maxims in practice.',
      ]},
    ]},
    { id: 'ch2', title: 'Chapter 2 — Dinacharya', articles: [
      { id: 'a2', title: 'Morning regimen', paragraphs: [
        'Waking before dawn helps harmonize the doshas. Cleanliness, mild exercise, and clarity in intent steady the mind.',
        'Appropriate diet and activity produce steadiness and joy when tailored to prakṛti and season.',
      ]},
    ]},
  ],
};

export default function LivingDocument({ route, navigation }) {
  const { colors, mode } = useThemeMode();
  const isGrey = mode === 'grey';

  // Book + reading state
  const incomingBookId = route?.params?.bookId;
  const book = DEMO_BOOK; // TODO: wire backend content
  const [chapterIdx, setChapterIdx] = useState(0);
  const [articleIdx, setArticleIdx] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [script, setScript] = useState(book.scripts[0]);

  // UI state
  const [pane, setPane] = useState(1); // 1..3
  const [navOpen, setNavOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [intelOpen, setIntelOpen] = useState(false);
  const [toolsVisible, setToolsVisible] = useState(true); // paragraph tools
  const [chromeVisible, setChromeVisible] = useState(true); // header + bottom bar
  const [shareOpen, setShareOpen] = useState(false);
  const [activeParaIdx, setActiveParaIdx] = useState(null);
  const [versionOpen, setVersionOpen] = useState(false);
  const [versionKey, setVersionKey] = useState(null);
  const [selectedVersions, setSelectedVersions] = useState({}); // token->label
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [selectionEditorOpen, setSelectionEditorOpen] = useState(false);
  const [selectionEditorText, setSelectionEditorText] = useState('');
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [interactOpen, setInteractOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [intelTab, setIntelTab] = useState('TOC'); // TOC | Glossary | Notes | Layers
  const [linkScroll, setLinkScroll] = useState(true);
  const paneRefs = useRef([]);
  const syncingRef = useRef(false);

  // Comments data
  const [comments, setComments] = useState([
    { id: 'c1', text: 'Insightful articulation of dinacharya.', up: 2, down: 0, replies: [{ id: 'c1r1', text: 'Agree; moderation is key.', up: 1, down: 0 }] },
  ]);
  const [newComment, setNewComment] = useState('');
  const [query, setQuery] = useState('');

  const chapter = book.chapters[chapterIdx];
  const article = chapter.articles[articleIdx];

  const onPaneCycle = () => setPane((p) => (p === 3 ? 1 : p + 1));
  const onFontChange = (delta) => setFontSize((s) => Math.max(12, Math.min(32, delta === 0 ? 18 : s + delta)));

  const goPrev = () => {
    if (articleIdx > 0) return setArticleIdx(articleIdx - 1);
    if (chapterIdx > 0) {
      const prevCh = book.chapters[chapterIdx - 1];
      setChapterIdx(chapterIdx - 1);
      setArticleIdx(Math.max(prevCh.articles.length - 1, 0));
    }
  };
  const goNext = () => {
    const ch = book.chapters[chapterIdx];
    if (articleIdx < ch.articles.length - 1) return setArticleIdx(articleIdx + 1);
    if (chapterIdx < book.chapters.length - 1) {
      setChapterIdx(chapterIdx + 1);
      setArticleIdx(0);
    }
  };

  const paraAction = (idx) => {
    setActiveParaIdx(idx);
    setInteractOpen(true);
  };

  // Version tokens
  const VERSION_BANK = {
    Langhana: ['Lightening therapy', 'Fasting / reduction', 'Caloric moderation'],
    'Dīpana': ['Kindling fire', 'Digestive stimulation', 'Metabolic priming'],
  };

  const openVersion = (key) => {
    setVersionKey(key);
    setVersionOpen(true);
  };

  const renderParagraph = (p, idx) => {
    const parts = String(p).split(/(\[\[(.+?)\]\])/g).filter(Boolean);
    return (
      <Pressable
        key={idx}
        onPress={() => setChromeVisible((v) => !v)}
        onLongPress={() => { setSelectionEditorText(String(p)); setSelectionRange({ start: 0, end: 0 }); setSelectionEditorOpen(true); }}
        style={{ marginBottom: 14, position: 'relative' }}
      >
        {/* Inline tools row above paragraph */}
        {toolsVisible && chromeVisible && (
          <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 10, marginBottom: 6 }}>
            <TouchableOpacity onPress={() => {/* summarize stub */}} style={[st.pillBtn, { backgroundColor: colors.text }]}>
              <FA name="star" size={10} color={colors.card} /><Text style={[st.pillText, { color: colors.card }]}>AI</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {/* translate stub */}} style={[st.pillBtn, { backgroundColor: colors.text }]}>
              <FA name="language" size={10} color={colors.card} /><Text style={[st.pillText, { color: colors.card }]}>TR</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text selectable style={{ color: colors.text, fontSize, lineHeight: Math.round(fontSize * 1.5) }}>
          {parts.map((seg, i) => {
            const m = seg.match(/^\[\[(.+?)\]\]$/);
            if (m) {
              const key = m[1];
              const chosen = selectedVersions[key];
              return (
                <Text key={i}>
                  <Text> </Text>
                  <Text onPress={() => openVersion(key)} style={{ backgroundColor: isGrey ? '#EEE' : 'rgba(250,204,21,0.25)', color: colors.text }}>
                    {chosen || key}
                  </Text>
                  <Text> </Text>
                </Text>
              );
            }
            return <Text key={i}>{seg}</Text>;
          })}
        </Text>

        {/* Interact toggle below paragraph (right aligned) */}
        {toolsVisible && chromeVisible && (
          <View style={{ alignItems: 'flex-start', marginTop: 6 }}>
            <TouchableOpacity onPress={() => { setSelectedText(parts.join(' ')); paraAction(idx); }} style={[st.interactBtn, { borderColor: colors.border }]}> 
              <FA name="hand-pointer" size={12} color={colors.text} />
              <Text style={{ color: colors.text, fontWeight: '700', marginLeft: 6 }}>Interact</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Paragraph separator */}
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginTop: 8 }} />
      </Pressable>
    );
  };

  const items = [
    { key: 'pane', icon: 'columns', onPress: onPaneCycle },
    { key: 'font', icon: 'text-height', onPress: () => setFontOpen(true) },
    { key: 'lang', icon: 'globe', onPress: () => setLangOpen(true) },
    { key: 'intel', icon: 'lightbulb', onPress: () => setIntelOpen(true) },
  ];

  return (
    <View style={[st.page, { backgroundColor: colors.bg }]}> 
      {chromeVisible && <AppHeader />}

      {/* Title + meta row */}
      {chromeVisible && (
      <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }}>
        <Text style={{ color: colors.text, fontWeight: '800' }}>{book.title}</Text>
        <Text style={{ color: '#666', fontSize: 12 }}>{chapter.title} · {article.title}</Text>
      </View>
      )}

      <View style={{ flex: 1 }}>
        {Array.from({ length: pane }).map((_, i) => (
          <View key={i} style={{ flex: 1 }}>
          <ScrollView
            ref={(r) => (paneRefs.current[i] = r)}
            onScroll={(e) => {
              if (!linkScroll) return;
              const y = e.nativeEvent.contentOffset?.y || 0;
              if (syncingRef.current) return;
              syncingRef.current = true;
              paneRefs.current.forEach((ref, idx) => {
                if (idx !== i && ref && ref.scrollTo) ref.scrollTo({ y, animated: false });
              });
              requestAnimationFrame(() => {
                syncingRef.current = false;
              });
            }}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
          >
            <Pressable onPress={() => setChromeVisible((v)=>!v)}>
              <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 8 }}>{i === 0 ? 'Primary' : `Commentary ${String.fromCharCode(64+i)}`}</Text>
            </Pressable>
            {article.paragraphs.map((p, idx) => renderParagraph(p, idx))}
            <View style={{ marginTop: 16 }}>
              <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 6 }}>Footnotes</Text>
              {['Context for langhana across seasons.'].map((f, j) => (
                <Text key={j} style={{ color: '#666', marginBottom: 4 }}>• {f}</Text>
              ))}
            </View>
            <View style={{ marginTop: 12, marginBottom: 8 }}>
              <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 6 }}>Special Notes</Text>
              {['Compare with Charaka’s guidance.'].map((f, j) => (
                <Text key={j} style={{ color: '#666', marginBottom: 4 }}>• {f}</Text>
              ))}
            </View>
            {/* Separator before comments */}
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
            {/* Comments (cards) */}
            <Text style={{ color: colors.text, fontWeight: '800', marginBottom: 8 }}>Comments</Text>
            {comments.map((c) => (
              <View key={c.id} style={[st.commentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <View style={[st.avatarSm, { backgroundColor: colors.text }]}><Text style={{ color: colors.card, fontWeight: '700' }}>AV</Text></View>
                  <Text style={{ color: colors.text, fontWeight: '700', marginLeft: 8 }}>Acharya</Text>
                </View>
                <Text style={{ color: colors.text }}>{c.text}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 }}>
                  <TouchableOpacity onPress={() => setComments(list => list.map(x => x.id === c.id ? { ...x, up: (x.up||0)+1 } : x))}><FA name="thumbs-up" size={14} color={colors.text} /></TouchableOpacity>
                  <Text style={{ color: '#666' }}>{c.up||0}</Text>
                  <TouchableOpacity onPress={() => setComments(list => list.map(x => x.id === c.id ? { ...x, down: (x.down||0)+1 } : x))}><FA name="thumbs-down" size={14} color={colors.text} /></TouchableOpacity>
                  <Text style={{ color: '#666' }}>{c.down||0}</Text>
                </View>
                {(c.replies||[]).map(r => (
                  <View key={r.id} style={{ marginLeft: 12, marginTop: 6, padding: 8, borderLeftWidth: 2, borderLeftColor: colors.border }}>
                    <Text style={{ color: colors.text }}>{r.text}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 20 }}>
              <TextInput value={newComment} onChangeText={setNewComment} placeholder="Add a comment…" placeholderTextColor="#888" style={[st.input, { flex: 1, borderColor: colors.border, color: colors.text }]} />
              <TouchableOpacity onPress={() => { if (newComment.trim()) { setComments(list => [...list, { id: Date.now()+'' , text: newComment.trim(), up:0, down:0, replies: [] }]); setNewComment(''); } }} style={[st.smallBtn, { backgroundColor: colors.text }]}>
                <Text style={{ color: colors.card, fontWeight: '700' }}>Post</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {i < pane - 1 && (
            <View style={{ alignItems: 'center', paddingVertical: 6 }}>
              <View style={{ height: 1, backgroundColor: colors.border, alignSelf: 'stretch' }} />
              <TouchableOpacity onPress={() => setLinkScroll((v)=>!v)} style={{ position: 'absolute', backgroundColor: colors.card, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FA name={linkScroll ? 'link' : 'unlink'} size={12} color={colors.text} />
                  <Text style={{ color: colors.text, fontWeight: '700' }}>{linkScroll ? 'Linked' : 'Unlinked'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          </View>
        ))}
      </View>

      {/* Bottom controls */}
      {chromeVisible && (
      <ContextBottomBar
        items={items}
        value={null}
        onChange={(k) => items.find((x) => x.key === k)?.onPress?.()}
        onFab={() => setNavOpen(true)}
      />)}

      {/* Navigator (center FAB) */}
      <Modal transparent visible={navOpen} animationType="slide" onRequestClose={() => setNavOpen(false)}>
        <View style={st.sheetBackdrop}>
          <View style={[st.sheet, { backgroundColor: colors.card }]}> 
            <View style={[st.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[st.sheetTitle, { color: colors.text }]}>Navigate</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              <TouchableOpacity onPress={goPrev} style={[st.navBtn, { backgroundColor: colors.text }]}>
                <FA name="chevron-left" color={colors.card} size={16} />
                <Text style={[st.navBtnText, { color: colors.card }]}>Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goNext} style={[st.navBtn, { backgroundColor: colors.text }]}>
                <Text style={[st.navBtnText, { color: colors.card }]}>Next</Text>
                <FA name="chevron-right" color={colors.card} size={16} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 260 }}>
              {book.chapters.map((c, ci) => (
                <View key={c.id} style={{ marginBottom: 8 }}>
                  <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 4 }}>{c.title}</Text>
                  {c.articles.map((a, ai) => (
                    <TouchableOpacity key={a.id} onPress={() => { setChapterIdx(ci); setArticleIdx(ai); setNavOpen(false); }} style={{ paddingVertical: 6 }}>
                      <Text style={{ color: colors.text }}>{a.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={st.sheetClose} onPress={() => setNavOpen(false)}>
              <Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Selection editor to capture an exact range from paragraph */}
      <Modal transparent visible={selectionEditorOpen} animationType="fade" onRequestClose={() => setSelectionEditorOpen(false)}>
        <View style={st.centerModal}>
          <View style={[st.popCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[st.sheetTitle, { color: colors.text }]}>Select Text</Text>
            <TextInput
              autoFocus
              multiline
              value={selectionEditorText}
              onChangeText={setSelectionEditorText}
              onSelectionChange={(e) => {
                const { start, end } = e.nativeEvent.selection || { start: 0, end: 0 };
                setSelectionRange({ start, end });
              }}
              style={[st.input, { borderColor: colors.border, color: colors.text, height: 140 }]}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity style={[st.smallBtn, { backgroundColor: colors.text }]} onPress={() => setSelectionEditorOpen(false)}>
                <Text style={{ color: colors.card, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[st.smallBtn, { backgroundColor: colors.text }]}
                onPress={() => {
                  const { start, end } = selectionRange;
                  const s = selectionEditorText.substring(Math.min(start, end), Math.max(start, end)).trim();
                  if (s.length > 0) {
                    setSelectedText(s);
                    setSelectionEditorOpen(false);
                    setSelectionOpen(true);
                  }
                }}
              >
                <Text style={{ color: colors.card, fontWeight: '700' }}>Attach Selection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Font switcher */}
      <Modal transparent visible={fontOpen} animationType="fade" onRequestClose={() => setFontOpen(false)}>
        <View style={st.centerModal}>
          <View style={[st.popCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[st.sheetTitle, { color: colors.text, marginBottom: 6 }]}>Font size</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => onFontChange(-2)} style={[st.smallBtn, { backgroundColor: colors.text }]}><Text style={{ color: colors.card, fontWeight: '700' }}>A-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => onFontChange(0)} style={[st.smallBtn, { backgroundColor: colors.text }]}><Text style={{ color: colors.card, fontWeight: '700' }}>A</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => onFontChange(+2)} style={[st.smallBtn, { backgroundColor: colors.text }]}><Text style={{ color: colors.card, fontWeight: '700' }}>A+</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={st.sheetClose} onPress={() => setFontOpen(false)}><Text style={[st.sheetCloseText, { color: colors.text }]}>Done</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language switcher */}
      <Modal transparent visible={langOpen} animationType="fade" onRequestClose={() => setLangOpen(false)}>
        <View style={st.centerModal}>
          <View style={[st.popCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[st.sheetTitle, { color: colors.text, marginBottom: 6 }]}>Language / Script</Text>
            {book.scripts.map((s) => (
              <TouchableOpacity key={s} onPress={() => { setScript(s); setLangOpen(false); }} style={{ paddingVertical: 8 }}>
                <Text style={{ color: colors.text }}>{s}{script === s ? ' ✓' : ''}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={st.sheetClose} onPress={() => setLangOpen(false)}><Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* IntelliCite panel (glossary/bookmarks/quotes/comments) */}
      <Modal transparent visible={intelOpen} animationType="slide" onRequestClose={() => setIntelOpen(false)}>
        <View style={st.sheetBackdrop}>
          <View style={[st.sheet, { backgroundColor: colors.card }]}> 
            <View style={[st.sheetHandle, { backgroundColor: colors.border }]} />
            {/* Quick tools */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10, justifyContent: 'flex-end' }}>
              <TouchableOpacity style={[st.iconTile, { borderColor: colors.border }]}><FA name="print" size={16} color={colors.text} /></TouchableOpacity>
              <TouchableOpacity style={[st.iconTile, { borderColor: colors.border }]}><FA name="bookmark" size={16} color={colors.text} /></TouchableOpacity>
              <TouchableOpacity style={[st.iconTile, { borderColor: colors.border }]} onPress={() => setShareOpen(true)}><FA name="share-alt" size={16} color={colors.text} /></TouchableOpacity>
            </View>

            {/* Intel tabs */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              {['TOC','Glossary','Notes','Layers'].map(t => (
                <TouchableOpacity key={t} onPress={() => setIntelTab(t)} style={[st.tabBtn, { borderColor: colors.border, backgroundColor: intelTab===t ? colors.text : 'transparent' }]}>
                  <Text style={{ color: intelTab===t ? colors.card : colors.text, fontWeight: '700', fontSize: 12 }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {intelTab === 'TOC' && (
              <ScrollView style={{ maxHeight: 280 }}>
                {book.chapters.map((c) => (
                  <View key={c.id} style={{ marginBottom: 8 }}>
                    <Text style={{ color: colors.text, fontWeight: '700' }}>{c.title}</Text>
                    {c.articles.map(a => (
                      <Text key={a.id} style={{ color: '#666', marginLeft: 8, marginTop: 2 }}>• {a.title}</Text>
                    ))}
                  </View>
                ))}
              </ScrollView>
            )}
            {intelTab === 'Glossary' && (
              <ScrollView style={{ maxHeight: 280 }}>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                  {['Global • Ayurveda', 'Local • Panchakarma'].map((g, i) => (
                    <View key={i} style={[st.actChip, { borderColor: colors.border }]}>
                      <FA name="circle" size={10} color={colors.text} />
                      <Text style={{ color: colors.text, fontSize: 12, marginLeft: 6 }}>{g}</Text>
                    </View>
                  ))}
                </View>
                {[{ term: 'Langhana', def: 'Lightening therapy.' }, { term: 'Dīpana', def: 'Kindling digestive fire.' }].map((g) => (
                  <View key={g.term} style={{ marginBottom: 10 }}>
                    <Text style={{ color: colors.text, fontWeight: '700' }}>{g.term}</Text>
                    <Text style={{ color: '#666' }}>{g.def}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
            {intelTab === 'Notes' && (
              <ScrollView style={{ maxHeight: 280 }}>
                {['Check seasonal regimen alignment','Add case reference later'].map((n,i)=> (
                  <View key={i} style={[st.intelRow, { borderColor: colors.border }]}><Text style={{ color: colors.text }}>{n}</Text></View>
                ))}
              </ScrollView>
            )}
            {intelTab === 'Layers' && (
              <ScrollView style={{ maxHeight: 280 }}>
                {['Layer • Clinical','Layer • Grammar'].map((n,i)=> (
                  <View key={i} style={[st.intelRow, { borderColor: colors.border }]}><Text style={{ color: colors.text }}>{n}</Text></View>
                ))}
              </ScrollView>
            )}
            <TextInput
              placeholder="Search…"
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              style={[st.input, { borderColor: colors.border, color: colors.text }]}
            />
            
            <TouchableOpacity style={st.sheetClose} onPress={() => setIntelOpen(false)}>
              <Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Interact popup for paragraph */}
      <Modal transparent visible={interactOpen} animationType="fade" onRequestClose={() => setInteractOpen(false)}>
        <View style={st.centerModal}>
          <View style={[st.popCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[st.sheetTitle, { color: colors.text }]}>Interact</Text>
            <Text style={{ color: '#666', marginBottom: 8 }} numberOfLines={3}>{selectedText}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[
                { k: 'cite', icon: 'quote-right', label: 'Add Citation' },
                { k: 'quote', icon: 'quote-left', label: 'Add Quote' },
                { k: 'note', icon: 'sticky-note', label: 'Add Note' },
                { k: 'layer', icon: 'layer-group', label: 'Add Layer' },
                { k: 'drift', icon: 'wind', label: 'Start Drift' },
                { k: 'wall', icon: 'share-square', label: 'Post to Wall' },
                { k: 'circle', icon: 'users', label: 'Post to Circle' },
                { k: 'discuss', icon: 'comments', label: 'Discuss' },
              ].map((a)=> (
                <View key={a.k} style={[st.iconChip, { borderColor: colors.border }]}>
                  <FA name={a.icon} size={14} color={colors.text} />
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700', marginLeft: 6 }}>{a.label}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={st.sheetClose} onPress={() => setInteractOpen(false)}><Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Selection scholarly tool (long-press substitute) */}
      <Modal transparent visible={selectionOpen} animationType="fade" onRequestClose={() => setSelectionOpen(false)}>
        <View style={st.centerModal}>
          <View style={[st.popCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[st.sheetTitle, { color: colors.text }]}>Selected Text</Text>
            <TextInput value={selectedText} onChangeText={setSelectedText} style={[st.input, { borderColor: colors.border, color: colors.text, height: 100 }]} multiline />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[
                { k: 'cite', icon: 'quote-right', label: 'Add Citation' },
                { k: 'quote', icon: 'quote-left', label: 'Add Quote' },
                { k: 'note', icon: 'sticky-note', label: 'Add Note' },
                { k: 'layer', icon: 'layer-group', label: 'Add Layer' },
                { k: 'drift', icon: 'wind', label: 'Start Drift' },
                { k: 'wall', icon: 'share-square', label: 'Post to Wall' },
                { k: 'circle', icon: 'users', label: 'Post to Circle' },
                { k: 'discuss', icon: 'comments', label: 'Discuss' },
              ].map((a)=> (
                <View key={a.k} style={[st.iconChip, { borderColor: colors.border }]}>
                  <FA name={a.icon} size={14} color={colors.text} />
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700', marginLeft: 6 }}>{a.label}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={st.sheetClose} onPress={() => setSelectionOpen(false)}><Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Share popup */}
      <Modal transparent visible={shareOpen} animationType="fade" onRequestClose={() => setShareOpen(false)}>
        <View style={st.centerModal}>
          <View style={[st.popCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[st.sheetTitle, { color: colors.text, marginBottom: 8 }]}>Share</Text>
            {[
              { icon: 'whatsapp', label: 'WhatsApp' },
              { icon: 'facebook', label: 'Facebook' },
              { icon: 'twitter', label: 'Twitter' },
              { icon: 'linkedin', label: 'LinkedIn' },
              { icon: 'link', label: 'Copy Link' },
            ].map((o) => (
              <View key={o.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <FA name={o.icon} size={16} color={colors.text} style={{ width: 24 }} />
                <Text style={{ color: colors.text }}>{o.label}</Text>
              </View>
            ))}
            <TouchableOpacity style={st.sheetClose} onPress={() => setShareOpen(false)}><Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Version chooser */}
      <Modal transparent visible={versionOpen} animationType="fade" onRequestClose={() => setVersionOpen(false)}>
        <View style={st.centerModal}>
          <View style={[st.popCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[st.sheetTitle, { color: colors.text, marginBottom: 8 }]}>Versions for “{versionKey}”</Text>
            {(VERSION_BANK[versionKey] || []).map((v) => (
              <TouchableOpacity key={v} onPress={() => { setSelectedVersions(prev => ({ ...prev, [versionKey]: v })); setVersionOpen(false); }} style={{ paddingVertical: 8 }}>
                <Text style={{ color: colors.text }}>{v}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={st.sheetClose} onPress={() => setVersionOpen(false)}><Text style={[st.sheetCloseText, { color: colors.text }]}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const st = StyleSheet.create({
  page: { flex: 1 },
  side: { width: 220, borderLeftWidth: StyleSheet.hairlineWidth },
  sideTitle: { fontWeight: '800', paddingHorizontal: 12, paddingTop: 10 },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  sheetHandle: { alignSelf: 'center', height: 4, width: 40, borderRadius: 2, marginBottom: 12 },
  sheetTitle: { fontWeight: '800', marginBottom: 8 },
  sheetClose: { marginTop: 12, alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  sheetCloseText: { fontWeight: '700' },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  navBtnText: { fontWeight: '700' },
  centerModal: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  popCard: { width: '80%', borderRadius: 12, padding: 16, borderWidth: StyleSheet.hairlineWidth },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  intelRow: { paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  commentCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, padding: 12, marginBottom: 8 },
  avatarSm: { height: 24, width: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pillBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontWeight: '700', fontSize: 10 },
  interactBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  interactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10},
  actChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  iconTile: { height: 36, width: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
  iconChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  smallBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
});
