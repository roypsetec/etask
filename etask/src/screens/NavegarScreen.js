// src/screens/NavegarScreen.js
import React, { useState, useCallback } from 'react'; // 1. Importar useCallback
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { Divider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // 2. Importar useFocusEffect

export default function App() {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    foto: null,
  });
  const navigation = useNavigation();

  // 3. Esta função busca os dados mais recentes do usuário
  const loadUserData = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Forçamos a releitura dos dados do perfil, caso tenham sido atualizados
      user.reload().then(() => {
        const refreshedUser = auth.currentUser; // Pega o usuário atualizado
        const nome = refreshedUser.displayName || '';
        const email = refreshedUser.email || '';
        const foto = refreshedUser.photoURL || null;
        setUserData({ nome, email, foto });
      });
    }
  };

  // 4. Usar useFocusEffect em vez de useEffect
  // Isso executa a função toda vez que a tela 'Navegar' entra em foco
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const getNomeParaExibir = () => {
    if (userData.nome) return userData.nome;
    if (userData.email) return userData.email.split('@')[0];
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.acessibilidade}>
        <Image
          source={
            userData.foto
              ? { uri: userData.foto }
              : require('../../assets/default-profile.png')
          }
          style={styles.perfil}
        />

        <Text style={styles.textUser}>
          {getNomeParaExibir() ? `Olá, ${getNomeParaExibir()}` : ''}
        </Text>

        <TouchableOpacity 
          style={styles.configuracao}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <Divider style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'center',
  },
  acessibilidade: {
    backgroundColor: '#262626',
    width: '100%',
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  perfil: {
    height: 35,
    width: 35,
    borderRadius: 20,
    marginLeft: 10,
    marginTop: 15,
  },
  textUser: {
    color: 'white',
    marginTop: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    flex: 1, 
  },
  configuracao: {
    padding: 10, 
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    width: '100%',
  },
});