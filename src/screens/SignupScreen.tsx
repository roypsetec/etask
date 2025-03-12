import React, { useState } from 'react';
import { TextInput, Button, View, Text } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Criação do usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário criado com sucesso:', userCredential.user);

      // Redireciona o usuário para a tela de login após o cadastro
      navigation.navigate('Login');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
      console.error('Erro ao criar usuário:', err);
    }
  };

  return (
    <View>
      <Text>Cadastro</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text>{error}</Text>}
      <Button title="Cadastrar" onPress={handleSignup} />
    </View>
  );
};

export default SignupScreen;
