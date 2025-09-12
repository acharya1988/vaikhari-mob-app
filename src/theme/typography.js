import { Platform } from 'react-native';

const family = Platform.select({ ios: 'Poppins_400Regular', android: 'Poppins_400Regular', default: 'Poppins_400Regular' });

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
  h1: { fontSize: typeScale.display52, fontFamily: 'Poppins_700Bold' },
  h2: { fontSize: typeScale.display72, fontFamily: 'Poppins_700Bold' },
  title: { fontSize: typeScale.title28, fontFamily: 'Poppins_700Bold' },
  subtitle: { fontSize: typeScale.title24, fontFamily: 'Poppins_600SemiBold' },
  body: { fontSize: typeScale.body17, fontFamily: family },
  callout: { fontSize: typeScale.callout16, fontFamily: 'Poppins_600SemiBold' },
  footnote: { fontSize: typeScale.footnote13, fontFamily: family },
};
