import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signUpWithEmail } from "../firebase/auth"; // Função corrigida de cadastro com Firebase

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      const user = await signUpWithEmail(email, password); // Usando a função correta
      Alert.alert("Sucesso", "Cadastro realizado com sucesso! Agora, faça login.");
      console.log("Cadastro bem-sucedido", user);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Redireciona para a tela de Login
      });
    } catch (error) {
      Alert.alert("Erro", error.message);
      console.error("Erro no cadastro:", error); // Log do erro
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Cadastrar" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SignupScreen;
