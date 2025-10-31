// src/screens/EditProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

// Imagem de perfil padrão
const defaultProfile = require('../../assets/default-profile.png');

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [nome, setNome] = useState(user?.displayName || '');
  const [imageUri, setImageUri] = useState(user?.photoURL || null); // URL da web ou URI local
  const [loading, setLoading] = useState(false);

  // Função para pedir permissão e escolher imagem
  const pickImage = async () => {
    // Pedir permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'É preciso permitir o acesso à galeria para trocar a foto.');
      return;
    }

    // Abrir a galeria
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri); // Seta a URI local da imagem selecionada
    }
  };

  // Função para fazer upload da imagem e retornar a URL
  const uploadImageAsync = async (uri) => {
    if (!user) return null;

    // Converte a URI da imagem (local) para um blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Cria uma referência no Storage (ex: 'profile-images/USER_ID.jpg')
    const storageRef = ref(storage, `profile-images/${user.uid}`);
    
    // Faz o upload
    await uploadBytes(storageRef, blob);

    // Retorna a URL de download
    return await getDownloadURL(storageRef);
  };

  // Função para salvar as alterações
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let newPhotoURL = user.photoURL; // Começa com a URL existente

      // 1. Se a imageUri mudou E não é uma URL http (ou seja, é uma uri local 'file://')
      if (imageUri && imageUri !== user.photoURL && !imageUri.startsWith('http')) {
        newPhotoURL = await uploadImageAsync(imageUri);
      }

      // 2. Prepara os dados para atualizar o perfil
      const updates = {};
      if (nome !== user.displayName) {
        updates.displayName = nome;
      }
      if (newPhotoURL && newPhotoURL !== user.photoURL) {
        updates.photoURL = newPhotoURL;
      }

      // 3. Atualiza o perfil se houver mudanças
      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
        Alert.alert('Sucesso', 'Perfil atualizado!');
        navigation.goBack();
      } else {
        Alert.alert('Nenhuma alteração', 'Nenhum dado foi modificado.');
      }

    } catch (error) {
      console.error("Erro ao salvar perfil: ", error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        <Image
          source={imageUri ? { uri: imageUri } : defaultProfile}
          style={styles.profileImage}
        />
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Nome de Exibição</Text>
      <TextInput
        style={styles.input}
        placeholder="Como você quer ser chamado?"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  imageContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#2d79f3',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#2d79f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});