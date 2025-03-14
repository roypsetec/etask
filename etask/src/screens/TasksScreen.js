
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TasksScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Tela de Tarefas!</Text>
      {/* Aqui você pode adicionar os componentes de gerenciamento de tarefas */}
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
  },
});

export default TasksScreen;