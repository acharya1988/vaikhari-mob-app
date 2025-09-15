import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import AppNavigation from "./src/navigation";
import Toast from "react-native-toast-message";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

  if (!fontsLoaded) {
    return null;
  }

  if (Text && !Text.defaultProps) Text.defaultProps = {};
  if (Text) Text.defaultProps.style = [Text.defaultProps.style, { fontFamily: 'Poppins_400Regular' }];
  if (TextInput && !TextInput.defaultProps) TextInput.defaultProps = {};
  if (TextInput) TextInput.defaultProps.style = [TextInput.defaultProps.style, { fontFamily: 'Poppins_400Regular' }];
  // return (
  //   <View style={styles.container}>
  //     <Text>Open up App.js to start working on your app!</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
  return (
    <>
      <AppNavigation />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
