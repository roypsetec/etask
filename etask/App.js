import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import TasksScreen from './src/screens/TasksScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import { auth } from './src/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar'; // Importando o StatusBar
import { Provider as PaperProvider } from 'react-native-paper'; // Importando o React Native Paper

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <PaperProvider>
      {/* Definindo a cor da StatusBar */}
      <StatusBar style="light" backgroundColor="#212121" />

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? 'Tasks' : 'Login'}
          screenOptions={{
            headerStyle: { backgroundColor: '#212121', elevation: 0, shadowOpacity: 0 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="Tasks" component={TasksScreen} options={{ title: 'Tarefas' }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar Senha' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
