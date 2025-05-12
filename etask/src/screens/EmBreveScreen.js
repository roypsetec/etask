import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getTasksByDate } from '../firebase/firestoreService';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';


const EmBreveScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleAddTask = async () => {
    if (taskTitle.trim() && taskDescription.trim()) {
      const auth = getAuth();
      const userId = auth.currentUser ? auth.currentUser.uid : 'desconhecido';

      // --- Correção: normalizar a data da deadline ---
      const normalizedDeadline = new Date(taskDeadline);
      normalizedDeadline.setHours(0, 0, 0, 0);  // Zera a hora para evitar problema de timezone

      const newTask = {
        title: taskTitle,
        description: taskDescription,
        deadline: Timestamp.fromDate(normalizedDeadline),
        completed: false,
        userId: userId,
        createdAt: Timestamp.now(),
      };

      try {
        await addDoc(collection(db, 'tarefas'), newTask);
        setTaskTitle('');
        setTaskDescription('');
        setTaskDeadline(new Date());
        setShowTaskInput(false);
      } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
      }
    } else {
      Alert.alert('Erro', 'Preencha todos os campos antes de adicionar a tarefa.');
    }
  };

  const handleDiscardTaskCreation = () => {
    setShowTaskInput(false);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline(new Date());
  };

  const handleOutsidePress = () => {
    if (showTaskInput) {
      Alert.alert(
        "Descartar tarefa?",
        "Tem certeza que deseja descartar a criação dessa tarefa?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Descartar", onPress: () => handleDiscardTaskCreation() }
        ]
      );
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTaskDeadline(selectedDate);
    }
    setShowDatePicker(false);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Em breve</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)} // `day.dateString` já é no formato 'YYYY-MM-DD'
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#2d79f3' },
        }}
        theme={{
          backgroundColor: '#212121',
          calendarBackground: '#212121',
          textSectionTitleColor: '#aaaaaa',
          textSectionTitleDisabledColor: '#555555',
          selectedDayBackgroundColor: '#2d79f3',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#2d79f3',
          dayTextColor: '#ffffff',
          textDisabledColor: '#555555',
          dotColor: '#2d79f3',
          selectedDotColor: '#ffffff',
          arrowColor: '#2d79f3',
          monthTextColor: '#ffffff',
          indicatorColor: '#2d79f3',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '400',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}

        renderHeader={(date) => {
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear();
          return (
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              {`${month} ${year}`}
            </Text>
          );
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowTaskInput(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {showTaskInput && (
        <Modal transparent animationType="slide">
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.modalOverlay}>
              <View style={styles.taskInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Título da tarefa"
                  placeholderTextColor="#ccc"
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Descrição da tarefa"
                  placeholderTextColor="#ccc"
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.calendarButton}>
                  <Ionicons name="calendar-outline" size={24} color="#fff" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={taskDeadline}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <View style={styles.taskInputButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleDiscardTaskCreation}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleAddTask}
                  >
                    <Ionicons name="send" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
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

  addButton: { backgroundColor: '#2d79f3', borderRadius: 10, position: 'absolute', bottom: 20, right: 40, padding: 10 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  taskInputContainer: { backgroundColor: '#333', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  input: { backgroundColor: '#444', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 },
  calendarButton: { backgroundColor: '#555', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  taskInputButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  sendButton: { backgroundColor: '#2d79f3', padding: 10, borderRadius: 10, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#fff', fontSize: 16 },
});

export default EmBreveScreen;
