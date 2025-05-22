//TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HojeScreen from '../screens/HojeScreen';
import EmBreveScreen from '../screens/EmBreveScreen';
import NavegarScreen from '../screens/NavegarScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Hoje"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2d79f3',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#262626',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Hoje"
        component={HojeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Em Breve"
        component={EmBreveScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Navegar"
        component={NavegarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
