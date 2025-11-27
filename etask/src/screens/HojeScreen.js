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

      {/* --- NOVA MENSAGEM DE CONCLUSÃO --- */}
      {lastCompletedTask && (
        <View style={styles.completedMessage}>
          <View style={styles.messageLeft}>
             <Ionicons name="checkmark-circle" size={20} color="#4caf50" style={{ marginRight: 8 }} />
             <Text style={styles.completedMessageText}>Concluído</Text>
          </View>
          <TouchableOpacity onPress={handleUndoCompletion} style={styles.undoButton}>
            <Text style={styles.undoButtonText}>Desfazer</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal de Tarefas */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
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

  // --- ESTILOS ATUALIZADOS DA MENSAGEM ---
  completedMessage: { 
    backgroundColor: '#333', // Fundo um pouco mais claro que o app
    padding: 15, 
    position: 'absolute', 
    bottom: 90, // Acima da tab bar
    left: 20, 
    right: 20, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 5, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50' // Detalhe verde lateral
  },
  messageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedMessageText: { 
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold'
  },
  undoButton: { 
    // Removido o fundo para ficar apenas texto, ou pode manter um fundo sutil
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  undoButtonText: { 
    color: '#2d79f3', // Azul de destaque
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
});

export default HojeScreen;