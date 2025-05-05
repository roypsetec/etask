import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, Alert, TouchableWithoutFeedback, FlatList, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // ajuste o caminho se necessário

const HojeScreen = () => {
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTask, setCompletedTask] = useState(null);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchTasks = async () => {
    try {
      const today = getTodayDate();
      const q = query(
        collection(db, 'tasks'),
        where('deadline', '==', today)
      );
      const querySnapshot = await getDocs(q);
      const tasksFromFirestore = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setTasks(tasksFromFirestore);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (taskTitle.trim() && taskDescription.trim()) {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline.toISOString().split('T')[0],
        completed: false,
      };
      try {
        await addDoc(collection(db, 'tasks'), newTask);
        fetchTasks(); // Atualiza a lista após adicionar
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

  const toggleTaskCompletion = async (taskId) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (taskToComplete) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        fetchTasks();
        setCompletedTask(taskToComplete);
        setTimeout(() => setCompletedTask(null), 10000);
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
      }
    }
  };

  const handleDiscardTask = () => {
    if (completedTask) {
      // Se quiser permitir restaurar, pode re-adicionar aqui
      setCompletedTask(null);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTaskDeadline(selectedDate);
    }
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date))) {
      return 'Data inválida';
    }
    return new Date(date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  const showDiscardConfirmationAlert = () => {
    Alert.alert(
      "Descartar tarefa?",
      "Tem certeza que deseja descartar a criação dessa tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Descartar", onPress: () => handleDiscardTaskCreation() }
      ]
    );
  };

  const handleDiscardTaskCreation = () => {
    setShowTaskInput(false);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline(new Date());
  };

  const handleOutsidePress = () => {
    if (showTaskInput) {
      showDiscardConfirmationAlert();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>Hoje</Text>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.noTasksText}>Nenhuma tarefa para hoje</Text>}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
                  <Ionicons
                    name={item.completed ? "checkbox" : "square-outline"}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                    {item.title}
                  </Text>
                  <Text style={styles.taskDescription}>{item.description}</Text>
                  <Text style={styles.taskDeadline}>{formatDate(item.deadline)}</Text>
                </View>
              </View>
            )}
          />

          {completedTask && (
            <View style={styles.completedMessage}>
              <Text style={styles.completedMessageText}>Você concluiu a tarefa "{completedTask.title}"</Text>
              <TouchableOpacity onPress={handleDiscardTask} style={styles.undoButton}>
                <Text style={styles.undoButtonText}>Descartar</Text>
              </TouchableOpacity>
            </View>
          )}

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
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212121', paddingHorizontal: 20, paddingTop: 10 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginLeft: -20 },
  noTasksText: { textAlign: 'center', color: '#ccc', marginTop: 20 },
  taskItem: { backgroundColor: '#333', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10 },
  taskContent: { marginLeft: 10 },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  taskDescription: { fontSize: 14, color: '#ccc' },
  taskDeadline: { fontSize: 12, color: '#aaa' },
  completedText: { textDecorationLine: 'line-through', color: '#bbb' },
  addButton: { backgroundColor: '#2d79f3', borderRadius: 10, position: 'absolute', bottom: 20, right: 20, padding: 10 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  taskInputContainer: { backgroundColor: '#333', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  input: { backgroundColor: '#444', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 },
  calendarButton: { backgroundColor: '#555', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  taskInputButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  sendButton: { backgroundColor: '#2d79f3', padding: 10, borderRadius: 10 },
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 10 },
  cancelButtonText: { color: '#fff', fontSize: 16 },
  completedMessage: { backgroundColor: '#444', padding: 15, position: 'absolute', bottom: 20, left: 20, right: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' },
  undoButton: { backgroundColor: '#f44336', padding: 5, borderRadius: 5 },
  undoButtonText: { color: '#fff', fontSize: 16 },
  completedMessageText: { color: '#fff', fontSize: 16 },
});

export default HojeScreen;
