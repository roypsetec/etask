// firebaseService.js
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Importa a instância do Firestore

const tarefasCollection = collection(db, "tarefas");

// Adicionar uma nova tarefa ao Firestore
export const addTask = async (task) => {
  try {
    await addDoc(tarefasCollection, task);
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
        deadline: data.deadline.toDate().toISOString().split('T')[0], // Formatação para data
        status: data.status,
        priority: data.priority
      };
    });

    return tasks;
  } catch (error) {
    console.error("Erro ao buscar tarefas por data:", error);
    return [];
  }
};
