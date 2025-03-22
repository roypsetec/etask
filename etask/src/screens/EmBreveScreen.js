//EmBreveScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Importa o componente de calendário

const EmBreveScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null); // Data selecionada no calendário
  const [tasks, setTasks] = useState([
    // Exemplo de tarefas
    { id: 1, title: 'Tarefa 1', description: 'Descrição da tarefa 1', deadline: '2025-03-25' },
    { id: 2, title: 'Tarefa 2', description: 'Descrição da tarefa 2', deadline: '2025-03-26' },
  ]);

  // Filtra as tarefas para a data selecionada
  const filteredTasks = tasks.filter((task) => task.deadline === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Em breve</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)} // Atualiza a data selecionada
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#2d79f3' }, // Marca a data selecionada
        }}
        theme={{
          todayTextColor: '#2d79f3',
          selectedDayBackgroundColor: '#2d79f3',
          arrowColor: '#2d79f3',
        }}
      />
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noTasksText}>Nenhuma tarefa para esta data</Text>}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#212121', 
    paddingHorizontal: 20, 
    paddingTop: 20, // Ajusta o topo com base na altura da StatusBar
  },
  screenTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 20, 
    marginLeft: 0, // Remove deslocamento desnecessário
  },
  selectedDateText: { 
    fontSize: 16, 
    color: '#fff', 
    marginVertical: 10 
  },
  noTasksText: { 
    textAlign: 'center', 
    color: '#ccc', 
    marginTop: 20 
  },
  taskItem: { 
    backgroundColor: '#333', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  taskTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  taskDescription: { 
    fontSize: 14, 
    color: '#ccc' 
  },
});

export default EmBreveScreen;
