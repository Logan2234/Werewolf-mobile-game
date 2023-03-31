//App.js
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginForm from './components/LoginForm';
import Bouton from './components/Bouton';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
    const [connected, isConnected] = useState(false);
    const [token, setToken] = useState(null);

    function connect(email, password) {
        fetch(`${BACKEND}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => { if (data.token) { setToken(data.token); } else { alert('Bad authentification'); } })
            .catch(error => alert('Server error'));
    }

    useEffect(() => {

    }, []);
    return (
        <View style={styles.container}>
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
