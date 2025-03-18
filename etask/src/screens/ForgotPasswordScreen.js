// C:\royps\etask\etask\src\screens\ForgotPasswordScreen.js

import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handlePasswordReset = () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail.');
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          'E-mail enviado!',
          'Verifique sua caixa de entrada para redefinir sua senha.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      })
      .catch((error) => {
        Alert.alert('Erro', error.message);
      });
  };

  return (
    <Container>
      <Title>Recuperar Senha</Title>
      <ImpactPhrase>Não deixe nada te parar. Recupere seu acesso e siga em frente!</ImpactPhrase>
      <InputWrapper>
        <Label>Email</Label>
        <InputRow>
          <Ionicons name="mail-outline" size={20} color="#fff" />
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
      <Button onPress={handlePasswordReset}>
        <ButtonText>Enviar E-mail de Recuperação</ButtonText>
      </Button>
    </Container>
  );
};

export default ForgotPasswordScreen;

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
