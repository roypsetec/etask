// src/screens/SettingsScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, // 1. Usar ScrollView para mais opções
  ActivityIndicator // 2. Para feedback visual
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// 3. Importar as funções de auth necessárias
import { signOut, sendPasswordResetEmail, deleteUser } from 'firebase/auth'; 
import { auth } from '../firebase/firebaseConfig';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // 4. Estado de loading

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // Reseta a navegação para a tela de Login
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

  // 5. NOVA FUNÇÃO: Redefinir Senha
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

  // 6. NOVA FUNÇÃO: Excluir Conta
  const handleDeleteAccount = () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    // 6a. Pedir confirmação é crucial
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
              // 6b. Tenta excluir o usuário
              await deleteUser(user);
              Alert.alert('Sucesso', 'Sua conta foi excluída.');
              // 6c. Desloga e volta para o Login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              setLoading(false);
              // 6d. Trata o erro comum de segurança
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
    // 7. Trocar View por ScrollView
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Configurações</Text>
      
      {loading ? (
        // 8. Mostrar indicador de atividade
        <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 20 }} />
      ) : (
        <>
          {/* 9. Botão de Redefinir Senha */}
          <TouchableOpacity 
            style={[styles.button, styles.buttonPrimary]} 
            onPress={handlePasswordReset}
          >
            <Text style={styles.buttonText}>Redefinir Senha</Text>
          </TouchableOpacity>

          {/* Botão Sair */}
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>

          {/* 10. Botão de Excluir Conta */}
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
  // 11. Novo estilo para o conteúdo do ScrollView
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
    marginTop: 15, // Espaçamento entre os botões
  },
  // 12. Estilos específicos para os botões
  buttonPrimary: {
    backgroundColor: '#2d79f3', // Azul (cor primária do app)
  },
  buttonSecondary: {
    backgroundColor: '#424242', // Cinza (neutro)
  },
  buttonDelete: {
    backgroundColor: '#f44336', // Vermelho (perigo)
    marginTop: 30, // Mais espaço antes da ação destrutiva
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});