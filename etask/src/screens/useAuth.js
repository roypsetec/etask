import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { signInWithCredential, GoogleAuthProvider, OAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // Assumindo que firebaseConfig.js está no mesmo diretório

WebBrowser.maybeCompleteAuthSession();

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // =========================
    // Login com Google
    // =========================
    const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
        expoClientId: '342221386398-q9s46o7s0g51frfj227747d515dnfmq8.apps.googleusercontent.com', // Substitua pelo seu Client ID do Expo
        iosClientId: 'SEU_CLIENT_ID_IOS', // Opcional: Substitua pelo seu Client ID iOS
        androidClientId: 'SEU_CLIENT_ID_ANDROID', // Opcional: Substitua pelo seu Client ID Android
        webClientId: '297569820456-80unu1fe358otvk714p395eg041dgtn2.apps.googleusercontent.com', // Opcional: Substitua pelo seu Client ID Web
    });

    useEffect(() => {
        if (googleResponse?.type === 'success') {
            const { id_token } = googleResponse.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .catch(error => {
                    console.error('Erro ao fazer login com Google:', error);
                    Alert.alert('Erro de Login', 'Não foi possível fazer login com Google. Tente novamente.');
                });
        }
    }, [googleResponse]);

    const signInWithGoogle = () => {
        if (!googleRequest) {
            Alert.alert('Erro', 'Configuração do Google Auth não carregada. Verifique seus Client IDs.');
            return;
        }
        googlePromptAsync();
    };

    // =========================
    // Login com Microsoft
    // =========================
    const microsoftDiscovery = {
        authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    };

    const [msRequest, msResponse, msPromptAsync] = AuthSession.useAuthRequest(
        {
            clientId: 'a2c876e2-a680-4531-8b80-77a867b91c40', // Substitua pelo seu Client ID da Microsoft
            scopes: ['openid', 'profile', 'email'],
            redirectUri: 'http://localhost:8081', // ALTERADO AQUI
        },
        microsoftDiscovery
    );


    useEffect(() => {
        // ... dentro do useEffect para msResponse
        if (msResponse?.type === "success") {
            const { accessToken, id_token } = msResponse.params; // Adicione accessToken aqui
            const provider = new OAuthProvider("microsoft.com");
            const credential = provider.credential({
                accessToken: accessToken, // Passe o accessToken
                idToken: id_token,        // E também o idToken
            });
            signInWithCredential(auth, credential)
                .catch(error => {
                    console.error("Erro ao fazer login com Microsoft:", error);
                    Alert.alert("Erro de Login", "Não foi possível fazer login com Microsoft. Tente novamente.");
                });
        }
        // ...

    }, [msResponse]);

    const signInWithMicrosoft = () => {
        if (!msRequest) {
            Alert.alert('Erro', 'Configuração do Microsoft Auth não carregada. Verifique seu Client ID.');
            return;
        }
        msPromptAsync();
    };

    return {
        user,
        loading,
        signInWithGoogle,
        signInWithMicrosoft,
    };
};