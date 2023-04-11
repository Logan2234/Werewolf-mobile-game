import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, BackHandler } from 'react-native';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import CreateSessionForm from './CreateSessionForm';
import JoinSession from './JoinSession';
import CreateOrJoin from './CreateOrJoin';
import { backgroundColor } from '../constants/colors';


const backActionHandler = () => {
    alert('Alert!', 'Are you sure you want to go back?');
};

export default function Home() {
    const [token, setToken] = useState(null);
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [loginOrRegister, setLoginOrRegister] = useState(1);
    const [createOrJoin, setCreateOrJoin] = useState(null);

    useEffect(() => {
        BackHandler.addEventListener('backButtonPressed', backActionHandler);
        return () =>
            // clear/remove event listener
            BackHandler.removeEventListener('backButtonPressed', backActionHandler);
    }, [createOrJoin]);

    return (<View style={styles.root}>
        {
            (token)
                ? (loginOrRegister)
                    ? <RegisterForm setToken={setToken} pseudo={pseudo} setPseudo={setPseudo} password={password} setPassword={setPassword} changeView={setLoginOrRegister} />
                    : <LoginForm setToken={setToken} pseudo={pseudo} setPseudo={setPseudo} password={password} setPassword={setPassword} changeView={setLoginOrRegister} />
                : (createOrJoin == null)
                    ? <CreateOrJoin onClick={setCreateOrJoin} />
                    : (createOrJoin)
                        ? <JoinSession changeView={setCreateOrJoin} />
                        : <CreateSessionForm changeView={setCreateOrJoin} />
        }
        <StatusBar style="auto" />
    </View>);
}

const styles = StyleSheet.create({
    root: { backgroundColor: backgroundColor },
});