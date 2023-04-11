//App.js
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { BACKEND } from './constants';
import CreateSession from './components/CreateSession';
import CreateForm from './components/CreateForm';

export default function App() {
    const [token, setToken] = useState(null);
    const [connexionOrRegistration, setConnexionOrRegistration] = useState(1);

    function createSession(pseudo, minPlayer, maxPlayer, lengthDay, lengthNight,
        startDate, contamination, insomnie, voyance, spiritisme, loupGarous) {
        fetch(`${BACKEND}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                minPlayer, maxPlayer, lengthDay, lengthNight,
                startDate, contamination, insomnie, voyance, spiritisme, loupGarous
            })
        })
            .then(response => response.json())
            .then(data => { if (data.token) { setToken(data.token); } else { alert('Pseudo ou mot de passe incorrect'); } })
            .catch(error => alert('Server error: ' + error));
    }

    return (
        <View style={styles.container}>
            {/* {
                (!token)
                    ? (connexionOrRegistration)
                        ? <RegisterForm setToken={setToken} changeView={setConnexionOrRegistration} />
                        : <LoginForm setToken={setToken} changeView={setConnexionOrRegistration} />
                    : <CreateSession onCreate={createSession} />
            } */}
            <CreateForm onCreate={createSession}/>
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
