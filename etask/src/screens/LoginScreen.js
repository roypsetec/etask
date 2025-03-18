// C:\royps\etask\etask\src\screens\LoginScreen.js

import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { loginWithEmail } from '../firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    try {
      await loginWithEmail(email, password);
      navigation.navigate('Tasks');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleForgotPassword = () => navigation.navigate('ForgotPassword');
  const handleSignUp = () => navigation.navigate('Signup');

  return (
    <Container>
      <Title>E-Task</Title>
      <InputWrapper>
        <Label>Email</Label>
        <InputRow>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <StyledTextInput
            placeholder="Digite seu email"
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
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <StyledTextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </InputRow>
      </InputWrapper>
      <ForgotPassword onPress={handleForgotPassword}>
        <ForgotPasswordText>Esqueceu a senha?</ForgotPasswordText>
      </ForgotPassword>
      <Button onPress={handleSignIn}>
        <ButtonText>Entrar</ButtonText>
      </Button>
      <SignUpWrapper>
        <SignUpText>Não tem uma conta? </SignUpText>
        <SignUpTouchable onPress={handleSignUp}>
          <SignUpLink>Criar conta</SignUpLink>
        </SignUpTouchable>
      </SignUpWrapper>
    </Container>
  );
};

export default LoginScreen;

// Estilização com styled-components/native

const Container = styled.View`
  flex: 1;
  background-color: #212121;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #fff;
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

const ForgotPassword = styled.TouchableOpacity`
  align-self: flex-end;
  margin-bottom: 15px;
`;

const ForgotPasswordText = styled.Text`
  color: #2d79f3;
  font-size: 14px;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  background-color: #151717;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 15px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const SignUpWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 15px;
`;

const SignUpText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const SignUpTouchable = styled.TouchableOpacity``;

const SignUpLink = styled.Text`
  color: #2d79f3;
  font-size: 14px;
  font-weight: 500;
`;
