import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabBar from '../components/TabBar';
import { FontAwesome5 as FA } from '@expo/vector-icons';

// Screens
import HomeGlowFeed from '../screens/HomeGlowFeed';
import ContinueReading from '../screens/ContinueReading';
import BookProfile from '../screens/BookProfile';
import Reader from '../screens/Reader';

import Library from '../screens/Library';

import Drifts from '../screens/Drifts';
import DriftDetail from '../screens/DriftDetail';

import Chintana from '../screens/Chintana';
import Compose from '../screens/Compose';

import Profile from '../screens/Profile';
import Circle from '../screens/Circle';
import People from '../screens/People';
import Search from '../screens/Search';
import Notifications from '../screens/Notifications';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeGlowFeed" component={HomeGlowFeed} />
      <Stack.Screen name="ContinueReading" component={ContinueReading} />
      <Stack.Screen name="BookProfile" component={BookProfile} />
      <Stack.Screen name="Reader" component={Reader} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Compose" component={Compose} />
    </Stack.Navigator>
  );
}

function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Library" component={Library} />
      <Stack.Screen name="BookProfile" component={BookProfile} />
      <Stack.Screen name="Reader" component={Reader} />
    </Stack.Navigator>
  );
}

function DriftsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drifts" component={Drifts} />
      <Stack.Screen name="DriftDetail" component={DriftDetail} />
    </Stack.Navigator>
  );
}

function ChintanaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chintana" component={Chintana} />
      <Stack.Screen name="Compose" component={Compose} />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Circle" component={Circle} />
      <Stack.Screen name="People" component={People} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home', tabBarIcon: ({ color, size }) => <FA name="home" color={color} size={size} /> }} />
      <Tab.Screen name="LibraryTab" component={LibraryStack} options={{ title: 'Library', tabBarIcon: ({ color, size }) => <FA name="book-open" color={color} size={size} /> }} />
      <Tab.Screen name="DriftsTab" component={DriftsStack} options={{ title: 'Drifts', tabBarIcon: ({ color, size }) => <FA name="comments" color={color} size={size} /> }} />
      <Tab.Screen name="ChintanaTab" component={ChintanaStack} options={{ title: 'Chintana', tabBarIcon: ({ color, size }) => <FA name="pen" color={color} size={size} /> }} />
      <Tab.Screen name="MoreTab" component={MoreStack} options={{ title: 'More', tabBarIcon: ({ color, size }) => <FA name="ellipsis-h" color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}
