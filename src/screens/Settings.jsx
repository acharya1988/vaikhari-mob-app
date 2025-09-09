import React, { useState } from 'react';
import Screen from '../layouts/Screen';
import Card from '../components/Card';
import { Switch, View, Text } from 'react-native';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  return (
    <Screen header={{ title: 'Settings' }}>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </Card>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </Card>
    </Screen>
  );
}

