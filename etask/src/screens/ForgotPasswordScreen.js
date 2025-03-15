import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth"; // Importando a função do Firebase
import { auth } from "../firebase/firebaseConfig"; // Certifique-se de que a configuração do Firebase está correta
import { useNavigation } from "@react-navigation/native"; // Importando para navegação

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handlePasswordReset = () => {
    if (email === "") {
      Alert.alert("Erro", "Por favor, insira seu e-mail.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Exibindo o alerta para o usuário
        Alert.alert(
          "E-mail enviado!",
          "Verifique sua caixa de entrada para redefinir sua senha.",
          [
            {
              text: "OK",
              onPress: () => {
                // Redirecionando o usuário para a tela de Login
                navigation.navigate("Login");
              },
            },
          ]
        );
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Erro", errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Enviar e-mail de recuperação" onPress={handlePasswordReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
