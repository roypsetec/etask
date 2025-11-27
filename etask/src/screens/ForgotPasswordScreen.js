import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

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
    <View style={styles.container}>
      {/* Ícone de Destaque */}
      <View style={styles.iconContainer}>
        <Ionicons name="lock-open-outline" size={80} color="#2d79f3" />
      </View>

      <Text style={styles.title}>Esqueceu a senha?</Text>
      <Text style={styles.subtitle}>
        Não se preocupe! Digite seu e-mail abaixo e enviaremos as instruções para recuperação.
      </Text>

      {/* Input de Email */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder="Digite seu e-mail cadastrado"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Botão Principal */}
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Enviar Link de Recuperação</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    padding: 20,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(45, 121, 243, 0.1)', // Fundo azul bem clarinho/transparente
    padding: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  textInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#2d79f3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});