import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation'; // Importa a navegação

const App = () => {
  return (
    <NavigationContainer>
      <Navigation />  {/* Chama a navegação dentro do app */}
    </NavigationContainer>
  );
};

export default App;
