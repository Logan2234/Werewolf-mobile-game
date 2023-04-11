import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import CreateSessionForm from './CreateSessionForm';
import { backgroundColor } from '../constants/colors';

export default function Home() {
    const [token, setToken] = useState(null);
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [connexionOrRegistration, setConnexionOrRegistration] = useState(1);
    return (<View style={styles.root}>
        {
            (token)
                ? (connexionOrRegistration)
                    ? <RegisterForm setToken={setToken} pseudo={pseudo} setPseudo={setPseudo} password={password} setPassword={setPassword} changeView={setConnexionOrRegistration} />
                    : <LoginForm setToken={setToken} pseudo={pseudo} setPseudo={setPseudo} password={password} setPassword={setPassword} changeView={setConnexionOrRegistration} />
                : <CreateSessionForm />
        }
        <StatusBar style="auto" />
    </View>);
}

const styles = StyleSheet.create({
    root: { backgroundColor: backgroundColor },
});