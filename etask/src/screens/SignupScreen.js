// C:\royps\etask\etask\src\screens\SignupScreen.js

import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { signUpWithEmail } from '../firebase/auth';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    try {
      const user = await signUpWithEmail(email, password);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Agora, faça login.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <Container>
      <Title>Cadastro</Title>
      <ImpactPhrase>Bem-vindo ao E-Task! Vamos juntos conquistar seus objetivos!</ImpactPhrase>
      <InputWrapper>
        <Label>Email</Label>
        <InputRow>
          <StyledTextInput
            placeholder="Digite seu e-mail"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </InputRow>
      </InputWrapper>
      <InputWrapper>
        <Label>Senha</Label>
        <InputRow>
          <StyledTextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </InputRow>
      </InputWrapper>
      <Button onPress={handleSignup}>
        <ButtonText>Cadastrar</ButtonText>
      </Button>
    </Container>
  );
};

export default SignupScreen;

// Estilização com styled-components/native

const Container = styled.View`
  flex: 1;
  background-color: #212121;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
`;

const ImpactPhrase = styled.Text`
  font-size: 16px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

const InputWrapper = styled.View`
  width: 100%;
  margin-bottom: 15px;
`;

const Label = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #333;
  border-radius: 10px;
  padding: 10px;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  margin-left: 10px;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  background-color: #151717;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
