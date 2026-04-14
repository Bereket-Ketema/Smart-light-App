import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/external/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/external/use-color-scheme';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="control"
        options={{
        title: 'Control',
        tabBarIcon: ({ color }) => <AntDesign name="control" size={24} color="black" />,
      }}
    />
    <Tabs.Screen
        name="settings"
        options={{
        title: 'Settings',
        tabBarIcon: ({ color }) => <AntDesign name="setting" size={24} color="black" />,
      }}
    />
    </Tabs>
  );
}
