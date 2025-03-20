// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeTabs from './src/navigation/TabNavigator';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import { auth } from './src/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="#212121" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? 'HomeTabs' : 'Login'}
          screenOptions={{
            headerStyle: { backgroundColor: '#212121', elevation: 0, shadowOpacity: 0 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar Senha' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
