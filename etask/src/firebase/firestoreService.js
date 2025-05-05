// firestoreService.js
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Importa a instância do Firestore

const tarefasCollection = collection(db, "tarefas");

// Adicionar uma nova tarefa ao Firestore
export const addTask = async (task) => {
  try {
    await addDoc(tarefasCollection, {
      ...task,
      createdAt: Timestamp.now(), // Sempre salva data de criação
      completed: false // Sempre inicia como não concluída
    });
    console.log("Tarefa adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
  }
};

// Obter tarefas filtradas por data
export const getTasksByDate = async (dateString) => {
  try {
    console.log("Buscando tarefas para a data:", dateString);  // Log da data que está sendo passada

    const startOfDay = new Date(dateString);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateString);
    endOfDay.setHours(23, 59, 59, 999);

    console.log("Início do dia:", startOfDay);
    console.log("Fim do dia:", endOfDay);

    const snapshot = await getDocs(
      query(
        tarefasCollection,
        where('deadline', '>=', Timestamp.fromDate(startOfDay)),
        where('deadline', '<=', Timestamp.fromDate(endOfDay))
      )
    );

    const tasks = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log("Tarefa encontrada:", data); // Log da tarefa encontrada
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        deadline: data.deadline.toDate().toISOString().split('T')[0], // Formatação para data (YYYY-MM-DD)
        completed: data.completed,
        userId: data.userId,
        createdAt: data.createdAt.toDate().toISOString()
      };
    });

    return tasks;
  } catch (error) {
    console.error("Erro ao buscar tarefas por data:", error);
    return [];
  }
};

// Atualizar status de conclusão da tarefa
export const toggleTaskCompletion = async (taskId, completed) => {
  try {
    const taskDoc = doc(db, "tarefas", taskId);
    await updateDoc(taskDoc, { completed });
    console.log(`Tarefa ${taskId} atualizada para completed=${completed}`);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
  }
};

// Excluir tarefa
export const deleteTask = async (taskId) => {
  try {
    const taskDoc = doc(db, "tarefas", taskId);
    await deleteDoc(taskDoc);
    console.log(`Tarefa ${taskId} deletada com sucesso`);
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
  }
};
