import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
        <Tabs.Screen
            name="chill"
            options={{
                title: 'Chill',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'fitness' : 'fitness-outline'} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="newlog"
            options={{
                title: 'Log',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="records"
            options={{
                title: 'Records',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="settings"
            options={{
                title: 'Settings',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
                ),
            }}
        />

    </Tabs>
  );
}
