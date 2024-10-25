import { Tabs } from 'expo-router';
import React from 'react';
import {Image, View} from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {NavigationContainer} from "@react-navigation/native";

const CustomTabIcon = ({ focused }) => {
    return (
        <View>
            <Image
                source={focused ? require('../../assets/images/gemini.png') : require('../../assets/images/gemini.png')}
                style={{ width: 24, height: 24, backgroundColor: (focused)?"#adbada": "", borderRadius: 5,}}
            />
        </View>
    );
};

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
                title: 'AI',
                tabBarIcon: ({ color, focused }) => (
                    <CustomTabIcon focused={focused} />
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
