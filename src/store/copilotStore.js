import { create } from 'zustand';

export const COPILOT_MODES = ['Scholar', 'Assistant', 'Doctor', 'Debate'];

export const useCopilotStore = create((set, get) => ({
  open: false,
  mode: 'Scholar',
  withContext: true,
  glow: false,
  query: '',
  messages: [
    { id: 'm1', role: 'system', text: 'Welcome to Vaikhari Copilot. Ask anything or pick a quick action.' },
  ],
  context: {
    book: null,
    threadId: null,
    circle: null,
  },

  setOpen: (open) => set({ open, glow: open }),
  toggleOpen: () => set((s) => ({ open: !s.open, glow: !s.open })),
  setMode: (mode) => set({ mode }),
  setWithContext: (v) => set({ withContext: v }),
  setGlow: (glow) => set({ glow }),
  setQuery: (q) => set({ query: q }),
  pushMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  // Quick actions
  doSummarize: () => {
    const { pushMessage } = get();
    pushMessage({ id: String(Date.now()), role: 'user', text: 'Summarize the current context.' });
  },
  doTranslate: () => {
    const { pushMessage } = get();
    pushMessage({ id: String(Date.now()), role: 'user', text: 'Translate selection to English with grammar notes.' });
  },
  doCite: () => {
    const { pushMessage } = get();
    pushMessage({ id: String(Date.now()), role: 'user', text: 'Cite sources and link to GranthaDNA.' });
  },
}));

