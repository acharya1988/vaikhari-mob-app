import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import RootNavigator from './RootNavigator';
import { ThemeProvider, useThemeMode } from '../theme/ThemeProvider';


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    text: '#000000',
    border: 'rgba(0,0,0,0.06)'
  },
};

function Nav() {
  const { colors } = useThemeMode();
  enableScreens(true);
  const themed = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.bg, text: colors.text, border: colors.border },
  };
  return (
    <NavigationContainer theme={themed}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function AppNavigation() {
  return (
    <ThemeProvider>
      <Nav />
    </ThemeProvider>
  );
}
