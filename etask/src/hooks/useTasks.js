import { useState, useEffect, useCallback } from 'react';
import { Alert, ToastAndroid, Keyboard } from 'react-native';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';

export const useTasks = (dateRangeFn) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NOVO ESTADO PARA O UNDO ---
  const [lastCompletedTask, setLastCompletedTask] = useState(null);

  // Estados para o Modal de Adicionar/Editar
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ... (as funções openModal, closeModal, handleSaveTask e handleDeleteTask continuam iguais)
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

  const handleDeleteTask = async (taskId) => {
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
  };

  // --- LÓGICA DE COMPLETAR TAREFA MODIFICADA ---
  const toggleTaskCompletion = async (taskId) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (taskToComplete) {
      try {
        await deleteDoc(doc(db, 'tarefas', taskId));
        
        // Guarda a tarefa completada e define um timer para limpar
        setLastCompletedTask(taskToComplete);
        setTimeout(() => setLastCompletedTask(null), 5000); // A mensagem some em 5 segundos

        fetchTasks();
      } catch (error) {
        console.error('Erro ao concluir tarefa:', error);
      }
    }
  };

  // --- NOVA FUNÇÃO PARA DESFAZER A AÇÃO ---
  const handleUndoCompletion = async () => {
    if (!lastCompletedTask) return;

    try {
      // Recria a tarefa no Firestore (sem o ID original)
      const { id, ...taskToRestore } = lastCompletedTask;
      await addDoc(collection(db, 'tarefas'), taskToRestore);
      
      setLastCompletedTask(null); // Limpa o estado para esconder a mensagem
      ToastAndroid.show('Tarefa restaurada!', ToastAndroid.SHORT);
      
      fetchTasks();
    } catch (error) {
        console.error('Erro ao restaurar tarefa:', error);
    }
  };

  // --- EXPORTAR OS NOVOS ESTADOS E FUNÇÕES ---
  return {
    tasks,
    loading,
    modalVisible,
    isEditMode,
    taskTitle,
    taskDescription,
    taskDeadline,
    showDatePicker,
    lastCompletedTask, // Exporta a última tarefa completada
    fetchTasks,
    openModal,
    closeModal,
    handleSaveTask,
    handleDeleteTask,
    toggleTaskCompletion,
    handleUndoCompletion, // Exporta a função de desfazer
    setTaskTitle,
    setTaskDescription,
    setTaskDeadline,
    setShowDatePicker,
  };
};