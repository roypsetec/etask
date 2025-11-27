import { useState, useCallback } from 'react';
import { Alert, ToastAndroid, Keyboard } from 'react-native';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

export const useTasks = (dateRangeFn) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Undo e Modal
  const [lastCompletedTask, setLastCompletedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Estados do Formulário
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { start, end } = dateRangeFn();
      
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
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  }, [user, dateRangeFn]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const openModal = (task = null) => {
    if (task) {
      setIsEditMode(true);
      setSelectedTask(task);
      setTaskTitle(task.title);
      setTaskDescription(task.description);
      setTaskDeadline(task.deadline.toDate());
    } else {
      setIsEditMode(false);
      setSelectedTask(null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDeadline(new Date());
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || !taskDescription.trim()) {
      Alert.alert('Erro', 'Preencha o título e a descrição da tarefa.');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && selectedTask) {
        const taskRef = doc(db, 'tarefas', selectedTask.id);
        await updateDoc(taskRef, {
          title: taskTitle,
          description: taskDescription,
          deadline: Timestamp.fromDate(taskDeadline),
        });
        ToastAndroid.show('Tarefa atualizada com sucesso!', ToastAndroid.SHORT);
      } else {
        const newTask = {
          title: taskTitle,
          description: taskDescription,
          deadline: Timestamp.fromDate(taskDeadline),
          completed: false,
          userId: user.uid,
          createdAt: Timestamp.now(),
        };
        await addDoc(collection(db, 'tarefas'), newTask);
      }
      closeModal();
      await fetchTasks();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ALTERAÇÃO AQUI: Nova lógica com confirmação
  // ============================================================
  const handleDeleteTask = (taskId) => {
    Alert.alert(
      "Excluir Tarefa", // Título
      "Tem certeza que deseja excluir esta tarefa permanentemente?", // Mensagem
      [
        {
          text: "Cancelar",
          style: "cancel" // Estilo visual de cancelamento
        },
        {
          text: "Excluir",
          style: "destructive", // Estilo visual destrutivo (vermelho no iOS)
          onPress: async () => {
            // Lógica real de exclusão (só roda se clicar aqui)
            setLoading(true);
            try {
              await deleteDoc(doc(db, 'tarefas', taskId));
              ToastAndroid.show('Tarefa excluída!', ToastAndroid.SHORT);
              await fetchTasks();
            } catch (error) {
              console.error('Erro ao deletar tarefa:', error);
              Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const toggleTaskCompletion = async (taskId) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (taskToComplete) {
      try {
        await deleteDoc(doc(db, 'tarefas', taskId));
        
        setLastCompletedTask(taskToComplete);
        setTimeout(() => setLastCompletedTask(null), 5000);

        fetchTasks();
      } catch (error) {
        console.error('Erro ao concluir tarefa:', error);
      }
    }
  };

  const handleUndoCompletion = async () => {
    if (!lastCompletedTask) return;

    try {
      const { id, ...taskToRestore } = lastCompletedTask;
      await addDoc(collection(db, 'tarefas'), taskToRestore);
      
      setLastCompletedTask(null);
      ToastAndroid.show('Tarefa restaurada!', ToastAndroid.SHORT);
      
      fetchTasks();
    } catch (error) {
        console.error('Erro ao restaurar tarefa:', error);
    }
  };

  return {
    tasks,
    loading,
    modalVisible,
    isEditMode,
    taskTitle,
    taskDescription,
    taskDeadline,
    showDatePicker,
    lastCompletedTask,
    fetchTasks,
    openModal,
    closeModal,
    handleSaveTask,
    handleDeleteTask,
    toggleTaskCompletion,
    handleUndoCompletion,
    setTaskTitle,
    setTaskDescription,
    setTaskDeadline,
    setShowDatePicker,
  };
};