import React, { useState } from 'react'; // Importa React e o hook useState para gerenciar estados
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  Modal, Alert, TouchableWithoutFeedback, FlatList, Keyboard 
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
  const [tasks, setTasks] = useState([]); // Lista de tarefas
  const [completedTask, setCompletedTask] = useState(null); // Armazena a tarefa concluída
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false); // Controla a exibição do modal de confirmação

  // Função para adicionar uma nova tarefa
  const handleAddTask = () => {
    if (taskTitle && taskDescription) { // Verifica se o título e a descrição foram preenchidos
      const newTask = { 
        id: Date.now(), // Gera um ID único baseado no timestamp atual
        title: taskTitle, // Define o título da tarefa
        description: taskDescription, // Define a descrição da tarefa
        deadline: taskDeadline, // Define a data limite da tarefa
        completed: false // Define que a tarefa não está concluída
      };
      setTasks([...tasks, newTask]); // Adiciona a nova tarefa à lista de tarefas
      setTaskTitle(''); // Limpa o campo de título
      setTaskDescription(''); // Limpa o campo de descrição
      setShowTaskInput(false); // Fecha o modal de criação de tarefa
    }
  };

  // Função para cancelar a criação de uma tarefa
  const handleCancelTaskCreation = () => {
    Alert.alert(
      "Descartar tarefa?", // Título do alerta
      "Tem certeza que deseja descartar a criação dessa tarefa?", // Mensagem do alerta
      [
        { text: "Cancelar", style: "cancel" }, // Botão para cancelar a ação
        { text: "Descartar", onPress: () => setShowTaskInput(false) } // Botão para descartar a tarefa
      ]
    );
  };

  // Função para alternar o estado de conclusão de uma tarefa
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) => { // Itera sobre a lista de tarefas
      if (task.id === taskId) { // Verifica se o ID da tarefa corresponde ao ID fornecido
        const updatedTask = { ...task, completed: !task.completed }; // Alterna o estado de conclusão da tarefa

        if (updatedTask.completed) { // Se a tarefa foi concluída
          setCompletedTask(updatedTask); // Define a tarefa como concluída
        } else {
          setCompletedTask(null); // Remove a tarefa concluída
        }

        return updatedTask; // Retorna a tarefa atualizada
      }
      return task; // Retorna a tarefa sem alterações
    });

    setTasks(updatedTasks); // Atualiza a lista de tarefas
  };

  // Função para descartar a conclusão de uma tarefa
  const handleDiscardTask = () => {
    if (completedTask) { // Verifica se há uma tarefa concluída
      setTasks(tasks.map(task =>
        task.id === completedTask.id ? { ...task, completed: false } : task // Define a tarefa como não concluída
      ));
      setCompletedTask(null); // Remove a tarefa concluída
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
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }); // Retorna a data formatada
  };

  const handleOutsidePress = () => {
    if (showTaskInput) {
      setShowDiscardConfirmation(true); // Mostra o modal de confirmação ao clicar fora
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Título "Hoje" no canto superior esquerdo */}
          <Text style={styles.screenTitle}>Hoje</Text>

          {/* Lista de tarefas */}
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

          {/* Mensagem de tarefa concluída */}
          {completedTask && (
            <View style={styles.completedMessage}>
              <Text style={styles.completedMessageText}>Você concluiu essa tarefa</Text>
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
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          {/* Modal de confirmação para descartar tarefa */}
          {showDiscardConfirmation && (
            <Modal transparent={true} animationType="fade">
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
    paddingTop: 20 // Ajusta o topo para alinhar o título com a status bar
  },
                screenTitle: { 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#fff', 
          marginBottom: 20, // Espaço abaixo do título
          textAlign: 'left', // Alinha o texto à esquerda
          width: '100%' // Garante que o texto ocupe toda a largura do container
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