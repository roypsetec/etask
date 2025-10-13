// src/screens/HojeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../hooks/useTasks';

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const HojeScreen = () => {
  const {
    tasks,
    loading,
    modalVisible,
    isEditMode,
    taskTitle,
    taskDescription,
    taskDeadline,
    showDatePicker,
    // NOVO (Passo 1): Pegar as novas propriedades do hook
    lastCompletedTask,
    handleUndoCompletion,
    openModal,
    closeModal,
    handleSaveTask,
    handleDeleteTask,
    toggleTaskCompletion,
    setTaskTitle,
    setTaskDescription,
    setTaskDeadline,
    setShowDatePicker,
  } = useTasks(getTodayRange);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Data inválida';
    return timestamp.toDate().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };
  
  if (loading && !modalVisible) {
    return <ActivityIndicator style={styles.loader} size="large" color="#fff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Hoje</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noTasksText}>Nenhuma tarefa para hoje</Text>}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Ionicons name={"square-outline"} size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskDeadline}>{formatDate(item.deadline)}</Text>
            </View>
            <TouchableOpacity onPress={() => openModal(item)}>
              <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* NOVO (Passo 2): Adicionar o componente visual da mensagem */}
      {lastCompletedTask && (
        <View style={styles.completedMessage}>
          <Text style={styles.completedMessageText}>Tarefa "{lastCompletedTask.title}" concluída!</Text>
          <TouchableOpacity onPress={handleUndoCompletion} style={styles.undoButton}>
            <Text style={styles.undoButtonText}>Desfazer</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        {/* ... (O conteúdo do Modal continua o mesmo) ... */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
                <View style={styles.taskInputContainer}>
                <Text style={styles.modalTitle}>{isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
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
                    <Text style={{color: '#fff', marginLeft: 10}}>{taskDeadline.toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                    value={taskDeadline}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                        setTaskDeadline(selectedDate);
                        }
                    }}
                    />
                )}
                <View style={styles.taskInputButtons}>
                    <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendButton} onPress={handleSaveTask}>
                    <Text style={{color: '#fff'}}>Salvar</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212121', paddingHorizontal: 20, paddingTop: 40 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  noTasksText: { textAlign: 'center', color: '#ccc', marginTop: 20 },
  taskItem: { backgroundColor: '#333', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10 },
  taskContent: { marginLeft: 10, flex: 1 },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  taskDescription: { fontSize: 14, color: '#ccc' },
  taskDeadline: { fontSize: 12, color: '#aaa' },
  addButton: { backgroundColor: '#2d79f3', borderRadius: 10, position: 'absolute', bottom: 20, right: 20, padding: 10 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  taskInputContainer: { backgroundColor: '#333', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#444', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 },
  calendarButton: { flexDirection: 'row', backgroundColor: '#555', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  taskInputButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  sendButton: { backgroundColor: '#2d79f3', padding: 12, borderRadius: 10, alignItems: 'center', flex: 1, marginLeft: 5 },
  cancelButton: { backgroundColor: '#f44336', padding: 12, borderRadius: 10, alignItems: 'center', flex: 1, marginRight: 5 },
  cancelButtonText: { color: '#fff', fontSize: 16 },
  loader: { flex: 1, justifyContent: 'center', backgroundColor: '#212121' },

  // NOVO (Passo 3): Adicionar os novos estilos no final
  completedMessage: { 
    backgroundColor: '#444', 
    padding: 15, 
    position: 'absolute', 
    bottom: 80, 
    left: 20, 
    right: 20, 
    borderRadius: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  completedMessageText: { 
    color: '#fff', 
    fontSize: 16 
  },
  undoButton: { 
    backgroundColor: '#2d79f3', 
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5 
  },
  undoButtonText: { 
    color: '#fff', 
    fontSize: 16 
  },
});

export default HojeScreen;