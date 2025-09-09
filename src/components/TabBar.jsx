import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { gradients } from '../theme/gradients';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

export default function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={s.wrap}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        const Icon = options.tabBarIcon;
        const iconEl = Icon ? Icon({ focused: isFocused, color: isFocused ? colors.white : colors.black, size: 20 }) : null;

        return (
          <Pressable key={route.key} onPress={onPress} style={{ flex: 1 }}>
            {isFocused ? (
              <LinearGradient colors={gradients.purpleOrange} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.itemActive}>
                <View style={{ alignItems: 'center' }}>{iconEl}</View>
                <Text style={s.labelActive}>{label}</Text>
              </LinearGradient>
            ) : (
              <View style={s.item}>
                <View style={{ alignItems: 'center' }}>{iconEl}</View>
                <Text style={s.label}>{label}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', padding: 8, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  item: { paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  itemActive: { paddingVertical: 8, borderRadius: 12 },
  label: { fontSize: 11, color: colors.black, textAlign: 'center', marginTop: 4 },
  labelActive: { fontSize: 11, color: '#FFF', textAlign: 'center', marginTop: 4 },
});
