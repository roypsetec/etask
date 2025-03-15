import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider 
} from "firebase/auth";
import { app } from "./firebaseConfig"; // Importe o app do arquivo firebaseConfig

// Inicialize a autenticação com o app exportado
const auth = getAuth(app); // Agora o auth está vinculado ao app

// Função para login com email e senha
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Retorna o usuário autenticado
  } catch (error) {
    throw new Error(error.message); // Exceção em caso de erro
  }
};

// Função para cadastro de usuário com email e senha
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Retorna o usuário cadastrado
  } catch (error) {
    throw new Error(error.message); // Exceção em caso de erro
  }
};

// Função para logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message); // Exceção em caso de erro
  }
};

// Provedor do Google
const googleProvider = new GoogleAuthProvider();

// Função para login com Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; // Retorna o usuário autenticado
  } catch (error) {
    throw new Error(error.message);
  }
};

// Provedor da Microsoft
const microsoftProvider = new OAuthProvider('microsoft.com');

// Função para login com Microsoft
export const loginWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    return result.user; // Retorna o usuário autenticado
  } catch (error) {
    throw new Error(error.message);
  }
};

// Exportando a instância do auth para uso em outros arquivos
export { auth };
