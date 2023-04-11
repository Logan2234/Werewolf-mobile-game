import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import CreateSessionForm from './CreateSessionForm';
import JoinSession from './JoinSession';
import CreateOrJoin from './CreateOrJoin';
import RecapSession from './ShareSession';
import { backgroundColor } from '../constants/colors';

export default function Home() {
    const [token, setToken] = useState(null);
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [loginOrRegister, setLoginOrRegister] = useState(1);
    const [createOrJoin, setCreateOrJoin] = useState(null);
    const [createdSession, setCreatedSession] = useState(false);

    useEffect(() => {
        const backActionHandler = () => {
            if (createOrJoin !== null) {
                setCreateOrJoin(null);
            } else {
                console.log(token);
                if (token !== null) {
                    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?',
                        [
                            { text: 'Non', onPress: () => null, style: 'default' },
                            { text: 'Oui', onPress: () => setToken(null), style: 'destructive' },
                        ],
                    );
                } else {
                    Alert.alert('Quitter', 'Voulez-vous vraiment vraiment quitter ?',
                        [
                            { text: 'Non', onPress: () => null, style: 'default' },
                            { text: 'Oui', onPress: () => BackHandler.exitApp(), style: 'destructive' },
                        ],
                    );
                }
            }
            return true;
        };

        BackHandler.addEventListener('backButtonPressed', backActionHandler);
        return () => BackHandler.removeEventListener('backButtonPressed', backActionHandler);

    }, [createOrJoin, token]);

    return (<View style={styles.root}>
        {
            (!token)
                ? (loginOrRegister)
                    ? <RegisterForm setToken={setToken} pseudo={pseudo} setPseudo={setPseudo} password={password} setPassword={setPassword} changeView={setLoginOrRegister} />
                    : <LoginForm setToken={setToken} pseudo={pseudo} setPseudo={setPseudo} password={password} setPassword={setPassword} changeView={setLoginOrRegister} />
                : (createOrJoin === null)
                    ? <CreateOrJoin onClick={setCreateOrJoin} />
                    : (createOrJoin)
                        ? <JoinSession changeView={setCreateOrJoin} />
                        : (!createdSession)
                            ? <CreateSessionForm changeView={setCreateOrJoin} token={token} />
                            : <RecapSession changeView={setCreatedSession}/>
        }
        <StatusBar style="auto" />
    </View>);
}

const styles = StyleSheet.create({
    root: { backgroundColor: backgroundColor },
});