//App.js
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Bouton from './components/Bouton';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
    const [connected, isConnected] = useState(false);
    const [token, setToken] = useState(null);

    function register(pseudo, password) {
        fetch (`${BACKEND}/signin`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pseudo, password })
        })
            .then(response => response.json())
            .catch(error => {
                alert('Pseudo déjà utilisé, veuillez en entrer un autre')
            });
    }

    function connect(pseudo, password) {
        fetch(`${BACKEND}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pseudo, password })
        })
            .then(response => response.json())
            .then(data => { if (data.token) { setToken(data.token); } else { alert('Pseudo ou mot de passe incorrect'); } })
            .catch(error => alert('Server error'));
    }

    useEffect(() => {

    }, []);
    return (
        <View style={styles.container}>
            <RegisterForm onRegister={register} />
            <LoginForm onConnect={connect} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLabel: {
        color: 'white',
        backgroundColor: 'blue',
        borderRadius: 5,
        margin: 5,
        padding: 5
    }
});
