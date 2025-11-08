// src/screens/EditProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker'; // Agora vai ser encontrado (Passo 1)
import { auth, storage } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const defaultProfile = require('../../assets/default-profile.png');

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [nome, setNome] = useState(user?.displayName || '');
  const [imageUri, setImageUri] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permissão necessária', 'É preciso permitir o acesso à galeria.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        // =======================================================
        // CORREÇÃO 1: A API espera uma string
        // =======================================================
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!pickerResult.canceled) {
        setImageUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao abrir o seletor de imagens:", error);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  const uploadImageAsync = async (uri) => {
    if (!user) return null;

    const response = await fetch(uri);
    const blob = await response.blob();

    // =======================================================
    // CORREÇÃO 2: Caminho IDÊNTICO ao da sua Regra (Passo 2)
    // (com "profile_images" e um nome de arquivo)
    // =======================================================
    const storageRef = ref(storage, `profile_images/${user.uid}/profile.jpg`);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let newPhotoURL = user.photoURL;

      if (imageUri && imageUri !== user.photoURL && !imageUri.startsWith('http')) {
        newPhotoURL = await uploadImageAsync(imageUri);
      }

      const updates = {};
      if (nome !== user.displayName) {
        updates.displayName = nome;
      }
      if (newPhotoURL && newPhotoURL !== user.photoURL) {
        updates.photoURL = newPhotoURL;
      }

      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
        Alert.alert('Sucesso', 'Perfil atualizado!');
        navigation.goBack();
      } else {
        Alert.alert('Nenhuma alteração', 'Nenhum dado foi modificado.');
      }

    } catch (error) {
      // O erro (storage/unknown) NÃO DEVE mais acontecer
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