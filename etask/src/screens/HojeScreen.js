// src/screens/HojeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const HojeScreen = () => {
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskAdded, setTaskAdded] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);
  const [completionMessage, setCompletionMessage] = useState(null);

  const handleAddTask = () => {
    if (taskTitle && taskDescription) {
      const newTask = { 
        title: taskTitle, 
        description: taskDescription, 
        deadline: taskDeadline, 
        completed: false
      };
      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDeadline(new Date());
      setShowTaskInput(false);
      setTaskAdded(true); // Tarefa foi adicionada
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || taskDeadline;
    setShowDatePicker(Platform.OS === 'ios');
    setTaskDeadline(currentDate);
  };

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('pt-BR', options); // Formato "27 março", "4 abril"
  };

  const toggleTaskCompletion = (taskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;

    // Se a tarefa foi concluída, removemos ela da lista e mostramos a mensagem de conclusão
    if (updatedTasks[taskIndex].completed) {
      setTasks(updatedTasks.filter((task, index) => index !== taskIndex));
      setCompletedTask(updatedTasks[taskIndex]);

      // Exibir a mensagem de conclusão temporária
      setCompletionMessage(`Você concluiu a tarefa: ${updatedTasks[taskIndex].title}`);
      
      // Definir um timeout para remover a mensagem após 10 segundos
      setTimeout(() => {
        setCompletionMessage(null);
      }, 10000); // Mensagem vai desaparecer após 10 segundos
    } else {
      // Se for marcada como pendente novamente, voltamos a tarefa para a lista
      setTasks([...updatedTasks, updatedTasks[taskIndex]]);
      setCompletedTask(null);
    }
  };

  const handleDiscardTask = () => {
    if (completedTask) {
      // Adiciona a tarefa concluída de volta ao final da lista
      const updatedTasks = [...tasks, { ...completedTask, completed: false }];
      setTasks(updatedTasks);
      setCompletedTask(null); // Limpa a tarefa concluída
      setCompletionMessage(null); // Remove a mensagem
    }
  };

  const renderAddTaskButton = () => {
    if (tasks.length === 0) {
      // Botão flutuante quando não há tarefas
      return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowTaskInput(true)}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      );
    } else {
      // Botão posicionado abaixo da última tarefa
      return (
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => setShowTaskInput(true)}
        >
          <Ionicons name="add" size={20} color="#fff" style={styles.addTaskIcon} />
          <Text style={styles.addTaskText}>Adicionar Tarefa</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Título "Hoje" no canto superior esquerdo */}
      <Text style={styles.screenTitle}>Hoje</Text>

      {/* Mensagem de criação de tarefas centralizada na tela */}
      {!taskAdded && tasks.length === 0 && (
        <View style={styles.centerContent}>
          <Text style={styles.title}>O que você precisa fazer hoje?</Text>
          <Text style={styles.subTitle}>
            Por padrão, as tarefas adicionadas aqui serão agendadas para hoje. Toque em + para adicionar uma tarefa.
          </Text>
        </View>
      )}

      {/* Lista de tarefas com margem mínima */}
      <View style={styles.taskList}>
        {tasks.map((task, index) => (
          !task.completed && (
            <View key={index} style={styles.taskItem}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <Text style={styles.taskDeadline}>{formatDate(task.deadline)}</Text>

              {/* Botão de checklist para concluir a tarefa (lado esquerdo) */}
              <TouchableOpacity 
                style={styles.checkButton} 
                onPress={() => toggleTaskCompletion(index)}
              >
                <Ionicons name="checkmark-circle-outline" size={32} color="#2d79f3" />
              </TouchableOpacity>
            </View>
          )
        ))}
      </View>

      {/* Mensagem quando a tarefa for concluída */}
      {completionMessage && (
        <View style={styles.completionMessageContainer}>
          <Text style={styles.completionMessage}>{completionMessage}</Text>
          <TouchableOpacity onPress={handleDiscardTask}>
            <Text style={styles.completionMessageAction}>Descartar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botão para adicionar tarefa */}
      {renderAddTaskButton()}

      {/* Janela de criação de tarefa */}
      {showTaskInput && (
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
          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Prazo"
              placeholderTextColor="#ccc"
              value={formatDate(taskDeadline)}
              editable={false}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={taskDeadline}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Botão para cancelar a criação da tarefa */}
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => {
              setShowTaskInput(false);
              Keyboard.dismiss(); // Fecha o teclado
            }}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleAddTask}>
            <Text style={styles.buttonText}>Adicionar Tarefa</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    paddingHorizontal: 20,
    paddingTop: 40, // Distância para a status bar
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    top: 40, // Distância do topo para a status bar
    left: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  taskList: {
    marginTop: 80, // Adicionando uma margem para não ficar colado no título
  },
  taskItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    paddingLeft: 40, // Movendo para a direita
  },
  taskDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
    paddingLeft: 40, // Movendo para a direita
  },
  taskDeadline: {
    fontSize: 12,
    color: '#ccc',
    paddingLeft: 40, // Movendo para a direita
  },
  checkButton: {
    position: 'absolute',
    top: 15,
    left: 15, // Botão à esquerda
  },
  completionMessageContainer: {
    position: 'absolute',
    bottom: 80, // Acima do botão flutuante
    left: 20,
    right: 20,
    backgroundColor: '#2d79f3',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completionMessage: {
    color: '#fff',
    fontSize: 16,
  },
  completionMessageAction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2d79f3',
    borderRadius: 10, // Mais quadrado
    position: 'absolute',
    bottom: 20, // Mais para baixo
    right: 20,
    padding: 10, // Menor
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  addTaskIcon: {
    marginRight: 10,
  },
  addTaskText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskInputContainer: {
    width: '90%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 100,
  },
  input: {
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2d79f3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HojeScreen;
