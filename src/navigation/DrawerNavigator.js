import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Activity from '../screens/Activity';

const Stack = createNativeStackNavigator();

// Simplified navigator without gestures or drawer dependency
export default function DrawerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Activity">
      <Stack.Screen name="Activity" component={Activity} />
    </Stack.Navigator>
  );
}
