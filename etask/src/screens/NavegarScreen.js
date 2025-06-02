import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { Divider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function App() {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    foto: null,
  });

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Extrai nome, email e foto
      const nome = user.displayName || '';
      const email = user.email || '';
      const foto = user.photoURL || null;

      setUserData({ nome, email, foto });
    }
  }, []);

  // Lógica para decidir o nome a mostrar
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

        <Ionicons name="settings-outline" size={24} color="#ffffff" style={styles.configuração} />
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
  },
  configuração: {
    paddingLeft: 230,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    width: '100%',
  },
});
