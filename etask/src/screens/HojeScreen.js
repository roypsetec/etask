import React, { useState } from 'react'; // Importa React e o hook useState para gerenciar estados
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, Alert, TouchableWithoutFeedback, FlatList, Keyboard, StatusBar
} from 'react-native'; // Removido KeyboardAvoidingView e Platform
import { Ionicons } from '@expo/vector-icons'; // Importa ícones da biblioteca Ionicons
import DateTimePicker from '@react-native-community/datetimepicker'; // Importa o seletor de data/hora

const HojeScreen = () => {
  // Estados para gerenciar diferentes aspectos da tela
  const [showTaskInput, setShowTaskInput] = useState(false); // Controla a exibição do modal de criação de tarefa
  const [taskTitle, setTaskTitle] = useState(''); // Armazena o título da tarefa
  const [taskDescription, setTaskDescription] = useState(''); // Armazena a descrição da tarefa
  const [taskDeadline, setTaskDeadline] = useState(new Date()); // Armazena a data limite da tarefa
  const [showDatePicker, setShowDatePicker] = useState(false); // Controla a exibição do seletor de data
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Tarefa 1', description: 'Descrição da tarefa 1', deadline: '2025-03-25', completed: false },
    { id: 2, title: 'Tarefa 2', description: 'Descrição da tarefa 2', deadline: '2025-03-26', completed: false },
  ]); // Lista de tarefas
  const [completedTask, setCompletedTask] = useState(null); // Armazena a tarefa concluída
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false); // Controla a exibição do modal de confirmação

  // Função para obter a data de hoje no formato "yyyy-mm-dd"
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Filtra as tarefas para exibir apenas as com prazo igual à data de hoje
  const filteredTasks = tasks.filter((task) => task.deadline === getTodayDate());

  // Função para adicionar uma nova tarefa
  const handleAddTask = () => {
    if (taskTitle.trim() && taskDescription.trim()) {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline.toISOString().split('T')[0], // Salva a data no formato "yyyy-mm-dd"
        completed: false,
      };

      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDeadline(new Date());
      setShowTaskInput(false);
    } else {
      Alert.alert('Erro', 'Preencha todos os campos antes de adicionar a tarefa.');
    }
  };

  // Função para exibir a mensagem de confirmação
  const showDiscardConfirmationAlert = () => {
    Alert.alert(
      "Descartar tarefa?", // Título do alerta
      "Tem certeza que deseja descartar a criação dessa tarefa?", // Mensagem do alerta
      [
        { text: "Cancelar", style: "cancel" }, // Botão para cancelar a ação
        { text: "Descartar", onPress: () => handleDiscardTaskCreation() } // Botão para descartar a tarefa
      ]
    );
  };

  // Função para descartar a criação da tarefa
  const handleDiscardTaskCreation = () => {
    setShowTaskInput(false);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline(new Date());
  };

  // Função para lidar com o clique fora da área de transferência
  const handleOutsidePress = () => {
    if (showTaskInput) {
      showDiscardConfirmationAlert(); // Exibe a mensagem de confirmação
    }
  };

  // Função para cancelar a criação de uma tarefa
  const handleCancelTaskCreation = () => {
    showDiscardConfirmation(); // Exibe a mensagem de confirmação
  };

  // Função para alternar o estado de conclusão de uma tarefa
  const toggleTaskCompletion = (taskId) => {
    const taskToComplete = tasks.find((task) => task.id === taskId);

    if (taskToComplete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskId); // Remove a tarefa da lista
      setTasks(updatedTasks); // Atualiza a lista de tarefas
      setCompletedTask(taskToComplete); // Armazena a tarefa concluída

      // Remove a mensagem de conclusão após 10 segundos
      setTimeout(() => {
        setCompletedTask(null); // Limpa o estado da tarefa concluída
      }, 10000); // 10 segundos
    }
  };

  // Função para descartar a conclusão de uma tarefa
  const handleDiscardTask = () => {
    if (completedTask) {
      setTasks([...tasks, { ...completedTask, completed: false }]); // Restaura a tarefa para a lista
      setCompletedTask(null); // Limpa o estado da tarefa concluída
    }
  };

  // Função para alterar a data limite da tarefa
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) { // Verifica se uma data foi selecionada
      setTaskDeadline(selectedDate); // Atualiza a data limite da tarefa
    }
    setShowDatePicker(false); // Fecha o seletor de data
  };

  // Função para formatar a data em um formato legível
  const formatDate = (date) => {
    if (!date || isNaN(new Date(date))) {
      return 'Data inválida'; // Retorna uma mensagem padrão se a data for inválida
    }
    return new Date(date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Título "Hoje" no canto superior esquerdo */}
          <Text style={styles.screenTitle}>Hoje</Text>

          {/* Lista de tarefas */}
          <FlatList
            data={filteredTasks}
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
                  <Text style={styles.taskDeadline}>
                    {formatDate(item.deadline)} {/* Formata a data */}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Mensagem de tarefa concluída */}
          {completedTask && (
            <View style={styles.completedMessage}>
              <Text style={styles.completedMessageText}>Você concluiu a tarefa "{completedTask.title}"</Text>
              <TouchableOpacity onPress={handleDiscardTask} style={styles.undoButton}>
                <Text style={styles.undoButtonText}>Descartar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Botão para adicionar tarefa */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowTaskInput(true)}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>

          {/* Modal para criar nova tarefa */}
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
                        onPress={handleCancelTaskCreation} // Usa a função centralizada
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

          {/* Modal de confirmação para descartar tarefa */}
          {showDiscardConfirmation && (
            <Modal transparent={true} animationType="fade">
              <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Deseja descartar a criação dessa tarefa?</Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setShowDiscardConfirmation(false)}
                      >
                        <Text style={styles.modalButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                          setShowTaskInput(false);
                          setTaskTitle('');
                          setTaskDescription('');
                          setTaskDeadline(new Date());
                          setShowDiscardConfirmation(false);
                        }}
                      >
                        <Text style={styles.modalButtonText}>Descartar</Text>
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

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  screenTitle: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 20, 
    marginLeft: -20, // Remove deslocamento desnecessário
  },
  noTasksText: { textAlign: 'center', color: '#ccc', marginTop: 20 }, // Texto exibido quando não há tarefas
  taskItem: { backgroundColor: '#333', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10 }, // Estilo de cada tarefa
  taskContent: { marginLeft: 10 }, // Conteúdo da tarefa
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' }, // Título da tarefa
  taskDescription: { fontSize: 14, color: '#ccc' }, // Descrição da tarefa
  taskDeadline: { fontSize: 12, color: '#aaa' }, // Data limite da tarefa
  completedText: { textDecorationLine: 'line-through', color: '#bbb' }, // Estilo para tarefas concluídas
  addButton: { backgroundColor: '#2d79f3', borderRadius: 10, position: 'absolute', bottom: 20, right: 20, padding: 10 }, // Botão flutuante de adicionar tarefa
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }, // Fundo do modal
  taskInputContainer: { backgroundColor: '#333', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }, // Container do modal
  input: { backgroundColor: '#444', color: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 }, // Campos de entrada
  calendarButton: { backgroundColor: '#555', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 10 }, // Botão de calendário
  taskInputButtons: { flexDirection: 'row', justifyContent: 'space-between' }, // Botões no modal
  sendButton: { backgroundColor: '#2d79f3', padding: 10, borderRadius: 10 }, // Botão de enviar
  cancelButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 10 }, // Botão de cancelar
  cancelButtonText: { color: '#fff', fontSize: 16 }, // Texto do botão de cancelar
  completedMessage: { backgroundColor: '#444', padding: 15, position: 'absolute', bottom: 20, left: 20, right: 20, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }, // Mensagem de tarefa concluída
  undoButton: { backgroundColor: '#f44336', padding: 5, borderRadius: 5 }, // Botão de desfazer conclusão
  undoButtonText: { color: '#fff', fontSize: 16 }, // Texto do botão de desfazer
  modalContainer: { backgroundColor: '#333', padding: 20, borderRadius: 10, alignItems: 'center' }, // Container do modal de confirmação
  modalText: { color: '#fff', fontSize: 16, marginBottom: 20 }, // Texto do modal de confirmação
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' }, // Botões do modal de confirmação
  modalButton: { backgroundColor: '#2d79f3', padding: 10, borderRadius: 10, flex: 1, alignItems: 'center', marginHorizontal: 5 }, // Botão do modal de confirmação
  modalButtonText: { color: '#fff', fontSize: 16 }, // Texto do botão do modal de confirmação
  completedMessageText: { color: '#fff', fontSize: 16 }, // Texto da mensagem de conclusão
});

export default HojeScreen; // Exporta o componente