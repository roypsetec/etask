// firestoreService.js
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

const tarefasCollection = collection(db, "tarefas");

export const addTask = async (task) => {
  try {
    await addDoc(tarefasCollection, {
      ...task,
      createdAt: Timestamp.now(),
      completed: false
    });
    console.log("Tarefa adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
  }
};

export const getTasksByDate = async (dateString, userId) => {

  const [year, month, day] = dateString.split('-').map(Number);

  const startDate = new Date(year, month - 1, day, 0, 0, 0);
  const endDate = new Date(year, month - 1, day + 1, 0, 0, 0);

  const tasksRef = collection(db, 'tarefas');
  const q = query(
    tasksRef,
    where('userId', '==', userId),
    where('deadline', '>=', Timestamp.fromDate(startDate)),
    where('deadline', '<', Timestamp.fromDate(endDate))
  );

  const snapshot = await getDocs(q);
  const tasks = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return tasks;
};

export const toggleTaskCompletion = async (taskId, completed) => {
  try {
    const taskDoc = doc(db, "tarefas", taskId);
    await updateDoc(taskDoc, { completed });
    console.log(`Tarefa ${taskId} atualizada para completed=${completed}`);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const taskDoc = doc(db, "tarefas", taskId);
    await deleteDoc(taskDoc);
    console.log(`Tarefa ${taskId} deletada com sucesso`);
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
  }
};
