import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useAuth } from './useAuth'; // Importa o novo hook

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { signInWithGoogle, signInWithMicrosoft } = useAuth(); // Usa o hook de autenticação

  // =========================
  // Login com Email/Senha
  // =========================
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

      {/* Email */}
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

      {/* Senha */}
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

      {/* Esqueceu senha */}
      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {/* Login com email/senha */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Login com Google */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#db4437" }]}
        onPress={signInWithGoogle}
      >
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>

      {/* Login com Microsoft */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2d79f3" }]}
        onPress={signInWithMicrosoft}
      >
        <Text style={styles.buttonText}>Entrar com Microsoft</Text>
      </TouchableOpacity>

      {/* Criar conta */}
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
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
  },
  textInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#2d79f3',
    fontSize: 14,
  },
  button: {
    width: '100%',
    backgroundColor: '#151717',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  signUpText: {
    color: '#fff',
    fontSize: 14,
  },
  signUpLink: {
    color: '#2d79f3',
    fontSize: 14,
    fontWeight: '500',
  },
});