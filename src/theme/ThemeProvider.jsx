import React, { createContext, useContext, useMemo, useState } from 'react';

const Palette = {
  light: { bg: '#FFFFFF', text: '#000000', card: '#FFFFFF', border: 'rgba(0,0,0,0.06)' },
  dark: { bg: '#121212', text: '#FFFFFF', card: '#1A1A1A', border: 'rgba(255,255,255,0.12)' },
  grey: { bg: '#F5F5F5', text: '#111111', card: '#FFFFFF', border: 'rgba(0,0,0,0.06)' },
};

const ThemeCtx = createContext({ mode: 'light', cycle: () => {}, colors: Palette.light });

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const colors = Palette[mode];
  const cycle = () => setMode((m) => (m === 'light' ? 'dark' : m === 'dark' ? 'grey' : 'light'));
  const value = useMemo(() => ({ mode, colors, cycle }), [mode]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useThemeMode() {
  return useContext(ThemeCtx);
}

