import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  Modal, KeyboardAvoidingView, Platform, Alert, 
  TouchableWithoutFeedback, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const HojeScreen = () => {
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTask, setCompletedTask] = useState(null);

  const handleAddTask = () => {
    if (taskTitle && taskDescription) {
      const newTask = { 
        id: Date.now(), 
        title: taskTitle, 
        description: taskDescription, 
        deadline: taskDeadline,
        completed: false 
      };
      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setTaskDescription('');
      setShowTaskInput(false);
    }
  };

  const handleCancelTaskCreation = () => {
    Alert.alert(
      "Descartar tarefa?",
      "Tem certeza que deseja descartar a criação dessa tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Descartar", onPress: () => setShowTaskInput(false) }
      ]
    );
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };

        if (updatedTask.completed) {
          setCompletedTask(updatedTask);
        } else {
          setCompletedTask(null);
        }

        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const handleDiscardTask = () => {
    if (completedTask) {
      setTasks(tasks.map(task =>
        task.id === completedTask.id ? { ...task, completed: false } : task
      ));
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
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Hoje</Text>

      <FlatList
        data={tasks.filter((task) => !task.completed)}
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
          <Text style={styles.completedText}>Você concluiu essa tarefa</Text>
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
          <TouchableWithoutFeedback onPress={handleCancelTaskCreation}>
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.taskInputContainer}
              >
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
                    onPress={handleCancelTaskCreation}
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
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212121', paddingHorizontal: 20, paddingTop: 40 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
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
});

export default HojeScreen;
