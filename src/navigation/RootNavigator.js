import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import Onboarding from '../screens/Onboarding';
import SignIn from '../screens/SignIn';
import MFA from '../screens/MFA';
import SignUp from '../screens/SignUp';
import EnrollMFA from '../screens/EnrollMFA';
import Home from '../screens/Home';
import Circle from '../screens/Circle';
import People from '../screens/People';
import Search from '../screens/Search';
import Notifications from '../screens/Notifications';
import Settings from '../screens/Settings';
import Compose from '../screens/Compose';
import DriftDetail from '../screens/DriftDetail';
import BookProfile from '../screens/BookProfile';
import Reader from '../screens/Reader';
import LivingDocument from '../screens/LivingDocument';
import ContinueReading from '../screens/ContinueReading';
import HomeGlowFeed from '../screens/HomeGlowFeed';
import Library from '../screens/Library';
import Drifts from '../screens/Drifts';
import Chintana from '../screens/Chintana';
import Activity from '../screens/Activity';
import Messages, { ChatThread, CircleThread, ChintanaThread } from '../screens/Messages';
import { useAuthStore } from '../store/authStore';


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token, hydrated, loadToken } = useAuthStore();

  useEffect(() => {
    if (!hydrated) loadToken();
  }, [hydrated]);

  // Wait for token hydration
  if (!hydrated) return null;

  if (!token) {
    // Public/auth stack only
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="EnrollMFA" component={EnrollMFA} />
        <Stack.Screen name="MFA" component={MFA} />
      </Stack.Navigator>
    );
  }

  // Authenticated: full app
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
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
      <Stack.Screen name="LivingDocument" component={LivingDocument} />
      <Stack.Screen name="ContinueReading" component={ContinueReading} />
      <Stack.Screen name="HomeGlowFeed" component={HomeGlowFeed} />
      <Stack.Screen name="Library" component={Library} />
      <Stack.Screen name="Drifts" component={Drifts} />
      <Stack.Screen name="Chintana" component={Chintana} />
      <Stack.Screen name="Activity" component={Activity} />
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="ChatThread" component={ChatThread} />
      <Stack.Screen name="CircleThread" component={CircleThread} />
      <Stack.Screen name="ChintanaThread" component={ChintanaThread} />
    </Stack.Navigator>
  );
}
