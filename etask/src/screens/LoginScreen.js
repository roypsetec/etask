import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useAuth } from './useAuth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { signInWithGoogle, signInWithMicrosoft } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('HomeTabs');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleForgotPassword = () => navigation.navigate('ForgotPassword');
  const handleSignUp = () => navigation.navigate('Signup');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-Task</Text>

      {/* Input de Email */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder="Digite seu email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Input de Senha */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão Esqueceu Senha */}
      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {/* Botão Principal de Login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Divisor Visual */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou continue com</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Botões Sociais (Google e Microsoft) */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={signInWithGoogle}>
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={signInWithMicrosoft}>
          <Ionicons name="logo-microsoft" size={24} color="#00A4EF" />
        </TouchableOpacity>
      </View>

      {/* Rodapé Criar Conta */}
      <View style={styles.signUpWrapper}>
        <Text style={styles.signUpText}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpLink}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#2d79f3',
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2d79f3', // Alterei para azul para destacar a ação principal
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos do Divisor
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  dividerText: {
    color: '#aaa',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  // Estilos dos Botões Sociais
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20, // Espaçamento entre os botões
    marginBottom: 30,
  },
  socialButton: {
    backgroundColor: '#333',
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  signUpWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#ccc',
    fontSize: 14,
  },
  signUpLink: {
    color: '#2d79f3',
    fontSize: 14,
    fontWeight: 'bold',
  },
});