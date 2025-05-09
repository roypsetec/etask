import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getTasksByDate } from '../firebase/firestoreService';
import { getAuth } from 'firebase/auth';


const EmBreveScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (selectedDate && currentUser) {
      console.log("Data selecionada:", selectedDate);
      getTasksByDate(selectedDate, currentUser.uid).then(tasks => {
        console.log("Tarefas retornadas:", tasks);
        setTasks(tasks);
      });
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Em breve</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)} // `day.dateString` já é no formato 'YYYY-MM-DD'
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#2d79f3' },
        }}
        theme={{
          todayTextColor: '#2d79f3',
          selectedDayBackgroundColor: '#2d79f3',
          arrowColor: '#2d79f3',
        }}
      />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
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
    paddingTop: 20, 
  },
  screenTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 20, 
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
