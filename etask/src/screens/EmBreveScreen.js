import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, Alert, TouchableWithoutFeedback, FlatList, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { ToastAndroid } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';


const EmBreveScreen = () => {
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTask, setCompletedTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const fetchTasks = async () => {
    if (!user || !selectedDate) return;

    try {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'tarefas'),
        where('userId', '==', user.uid),
        where('deadline', '>=', Timestamp.fromDate(start)),
        where('deadline', '<=', Timestamp.fromDate(end))
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
  }, [selectedDate]);

  const handleAddTask = async () => {
    if (taskTitle.trim() && taskDescription.trim()) {
      const userId = user ? user.uid : 'desconhecido';
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        deadline: Timestamp.fromDate(taskDeadline),
        completed: false,
        userId: userId,
        createdAt: Timestamp.now(),
      };
      try {
        await addDoc(collection(db, 'tarefas'), newTask);
        fetchTasks();
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
        await deleteDoc(doc(db, 'tarefas', taskId));
        fetchTasks();
        setCompletedTask(taskToComplete);
        setTimeout(() => setCompletedTask(null), 10000);
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tarefas', taskId));
      fetchTasks();
      setShowOptionsModal(false);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const openTaskOptions = (task) => {
    setSelectedTask(task);
    setShowOptionsModal(true);
  };

  const handleEditTask = async () => {
    if (selectedTask) {
      try {
        const taskRef = doc(db, 'tarefas', selectedTask.id);
        await updateDoc(taskRef, {
          title: selectedTask.title,
          description: selectedTask.description,
          deadline: selectedTask.deadline,
        });
        fetchTasks();
        setShowEditModal(false);
        setShowOptionsModal(false);
        setSelectedTask(null);
        ToastAndroid.show('Tarefa atualizada com sucesso!', ToastAndroid.SHORT);
      } catch (error) {
        console.error("Erro ao editar tarefa:", error);
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTaskDeadline(selectedDate);
    }
    setShowDatePicker(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Data inválida';
    const date = timestamp.toDate();
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
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

  LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
  };

  LocaleConfig.defaultLocale = 'pt-br';

  const handleDiscardTask = async () => {
    if (completedTask) {
        try {

        await addDoc(collection(db, 'tarefas'), {
          title: completedTask.title,
          deadline: completedTask.deadline,
          completed: false,
          userId: completedTask.userId,
          createdAt: completedTask.createdAt,
          description: completedTask.description,
        });

        fetchTasks();
        setCompletedTask(null);
        ToastAndroid.show('Tarefa restaurada com sucesso!', ToastAndroid.SHORT);
      } catch (error) {
        console.error('Erro ao restaurar tarefa:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Em breve</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#2d79f3' },
        }}
        theme={{
          backgroundColor: '#212121',
          calendarBackground: '#212121',
          textSectionTitleColor: '#aaaaaa',
          selectedDayBackgroundColor: '#2d79f3',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#2d79f3',
          dayTextColor: '#ffffff',
          textDisabledColor: '#555555',
          arrowColor: '#2d79f3',
          monthTextColor: '#ffffff',
        }}
      />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noTasksText}>Nenhuma tarefa para esta data</Text>}
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

            <TouchableOpacity onPress={() => openTaskOptions(item)}>
              <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={showOptionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOptionsModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.taskInputContainer}>
              <Text style={[styles.taskTitle, { marginBottom: 15 }]}>Opções da Tarefa</Text>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => setShowEditModal(true)}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>Editar tarefa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelButton, { marginTop: 10 }]}
                onPress={() => deleteTask(selectedTask.id)}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>Excluir tarefa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelButton, { marginTop: 10 }]}
                onPress={() => setShowOptionsModal(false)}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEditModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.taskInputContainer}>
              <Text style={[styles.taskTitle, { marginBottom: 15 }]}>Editar Tarefa</Text>

              <TextInput
                style={styles.input}
                placeholder="Título da tarefa"
                placeholderTextColor="#ccc"
                value={selectedTask?.title}
                onChangeText={(text) => setSelectedTask({ ...selectedTask, title: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição da tarefa"
                placeholderTextColor="#ccc"
                value={selectedTask?.description}
                onChangeText={(text) => setSelectedTask({ ...selectedTask, description: text })}
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.calendarButton}>
                <Ionicons name="calendar-outline" size={24} color="#fff" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedTask?.deadline.toDate() || new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setSelectedTask({ ...selectedTask, deadline: Timestamp.fromDate(selectedDate) });
                    }
                    setShowDatePicker(false);
                  }}
                />
              )}

              <View style={styles.taskInputButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleEditTask}
                >
                  <Ionicons name="checkmark" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212121', paddingHorizontal: 20, paddingTop: 20 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  noTasksText: { textAlign: 'center', color: '#ccc', marginTop: 20 },
  taskItem: { backgroundColor: '#333', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10 },
  taskContent: { marginLeft: 10, flex: 1 },
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
  sendButton: { backgroundColor: '#2d79f3', padding: 10, borderRadius: 10, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#fff', fontSize: 16 },
  completedMessage: { backgroundColor: '#444', padding: 15, position: 'absolute', bottom: 80, left: 20, right: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', },
  undoButton: { backgroundColor: '#f44336', padding: 5, borderRadius: 5 },
  undoButtonText: { color: '#fff', fontSize: 16 },
  completedMessageText: { color: '#fff', fontSize: 16 },
});

export default EmBreveScreen;
