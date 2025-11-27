// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 1. IMPORTAR O HOOK DE INSETS
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import HojeScreen from '../screens/HojeScreen';
import EmBreveScreen from '../screens/EmBreveScreen';
import NavegarScreen from '../screens/NavegarScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  // 2. PEGAR AS MEDIDAS SEGURAS
  const insets = useSafeAreaInsets(); 

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
          // 3. CALCULAR ALTURA E PADDING DINAMICAMENTE
          // A altura base é 60, somamos o que o sistema precisar na parte de baixo
          height: 60 + insets.bottom, 
          // O padding base é 10, somamos a área do sistema
          paddingBottom: 10 + insets.bottom, 
          paddingTop: 10, // Adicionei um pouco de padding no topo para centralizar os ícones
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