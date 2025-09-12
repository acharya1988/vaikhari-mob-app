import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import BottomTabs from './BottomTabs';
import Activity from '../screens/Activity';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      id="RootDrawer"
      initialRouteName="Activity"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      {/* Primary home is Activity */}
      <Drawer.Screen name="Activity" component={Activity} />
    </Drawer.Navigator>
  );
}
