import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import Onboarding from '../screens/Onboarding';
import SignIn from '../screens/SignIn';
import MFA from '../screens/MFA';
import Circle from '../screens/Circle';
import People from '../screens/People';
import Search from '../screens/Search';
import Notifications from '../screens/Notifications';
import Settings from '../screens/Settings';
import Compose from '../screens/Compose';
import DriftDetail from '../screens/DriftDetail';
import BookProfile from '../screens/BookProfile';
import Reader from '../screens/Reader';
import ContinueReading from '../screens/ContinueReading';
import HomeGlowFeed from '../screens/HomeGlowFeed';
import Library from '../screens/Library';
import Drifts from '../screens/Drifts';
import Chintana from '../screens/Chintana';
import Activity from '../screens/Activity';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
      {/* Auth/onboarding flow (mock) */}
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="MFA" component={MFA} />

      {/* App main drawer */}
      <Stack.Screen name="Main" component={DrawerNavigator} />

      {/* Global routes for easy navigate('ScreenName') */}
      <Stack.Screen name="Circle" component={Circle} />
      <Stack.Screen name="People" component={People} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Compose" component={Compose} />
      <Stack.Screen name="DriftDetail" component={DriftDetail} />
      <Stack.Screen name="BookProfile" component={BookProfile} />
      <Stack.Screen name="Reader" component={Reader} />
      <Stack.Screen name="ContinueReading" component={ContinueReading} />
      <Stack.Screen name="HomeGlowFeed" component={HomeGlowFeed} />
      <Stack.Screen name="Library" component={Library} />
      <Stack.Screen name="Drifts" component={Drifts} />
      <Stack.Screen name="Chintana" component={Chintana} />
      <Stack.Screen name="Activity" component={Activity} />
    </Stack.Navigator>
  );
}
