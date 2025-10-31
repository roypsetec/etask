// src/screens/SettingsScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, sendPasswordResetEmail, deleteUser } from 'firebase/auth'; 
import { auth } from '../firebase/firebaseConfig';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 

  // ... (funções handleLogout, handlePasswordReset, handleDeleteAccount permanecem iguais) ...
  // (Colei elas aqui para garantir, mas não mudei nada nelas)
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handlePasswordReset = () => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    setLoading(true);
    sendPasswordResetEmail(auth, user.email)
      .then(() => {
        Alert.alert(
          'E-mail enviado!',
          `Um link para redefinir sua senha foi enviado para ${user.email}.`
        );
      })
      .catch((error) => {
        Alert.alert('Erro', error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteAccount = () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    Alert.alert(
      'Excluir conta?',
      'Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita. Você precisará fazer login novamente para confirmar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteUser(user);
              Alert.alert('Sucesso', 'Sua conta foi excluída.');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              setLoading(false);
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Ação Requer Autenticação',
                  'Para excluir sua conta, faça logout e login novamente. Isso é necessário por motivos de segurança.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Fazer Logout', onPress: handleLogout }
                  ]
                );
              } else {
                Alert.alert('Erro', error.message);
              }
              console.error("Erro ao excluir conta:", error);
            }
          },
        },
      ]
    );
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Configurações</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 20 }} />
      ) : (
        <>
          {/* 1. NOVO BOTÃO DE EDITAR PERFIL */}
          <TouchableOpacity 
            style={[styles.button, styles.buttonPrimary]} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        
          <TouchableOpacity 
            style={[styles.button, styles.buttonPrimary]} 
            onPress={handlePasswordReset}
          >
            <Text style={styles.buttonText}>Redefinir Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonDelete]} 
            onPress={handleDeleteAccount}
          >
            <Text style={styles.buttonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15, 
  },
  buttonPrimary: {
    backgroundColor: '#2d79f3', 
  },
  buttonSecondary: {
    backgroundColor: '#424242',
  },
  buttonDelete: {
    backgroundColor: '#f44336', 
    marginTop: 30, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});