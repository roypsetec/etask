import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase/firebaseConfig'; // Importa a configuração do Firebase
import { signInWithEmailAndPassword } from 'firebase/auth'; // Método de login

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para armazenar a mensagem de erro

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Limpar a mensagem de erro anterior

    try {
      // Tenta realizar o login com email e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Home'); // Navega para a tela principal após o login
    } catch (error: any) {
      // Se ocorrer um erro, ele captura e exibe a mensagem
      setErrorMessage(error.message); // Atualiza o estado de erro
      Alert.alert('Erro', error.message); // Exibe um alerta de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* Exibindo a mensagem de erro abaixo dos campos */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button title={loading ? "Carregando..." : "Entrar"} onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
