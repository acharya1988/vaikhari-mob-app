import React from 'react';
import { ScrollView } from 'react-native';
import Screen from './Screen';

export default function ScrollScreen({ children, header, contentContainerStyle, ...rest }) {
  return (
    <Screen header={header}>
      <ScrollView contentContainerStyle={[{ paddingBottom: 24 }, contentContainerStyle]} {...rest}>
        {children}
      </ScrollView>
    </Screen>
  );
}

