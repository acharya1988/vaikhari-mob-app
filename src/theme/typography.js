import { Platform } from 'react-native';

const family = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

export const typeScale = {
  display120: 120,
  display88: 88,
  display72: 72,
  display52: 52,
  title28: 28,
  title24: 24,
  body17: 17,
  callout16: 16,
  footnote13: 13,
};

export const typography = {
  h1: { fontSize: typeScale.display52, fontWeight: '700', fontFamily: family },
  h2: { fontSize: typeScale.display72, fontWeight: '700', fontFamily: family },
  title: { fontSize: typeScale.title28, fontWeight: '700', fontFamily: family },
  subtitle: { fontSize: typeScale.title24, fontWeight: '600', fontFamily: family },
  body: { fontSize: typeScale.body17, fontWeight: '400', fontFamily: family },
  callout: { fontSize: typeScale.callout16, fontWeight: '500', fontFamily: family },
  footnote: { fontSize: typeScale.footnote13, fontWeight: '400', fontFamily: family },
};

