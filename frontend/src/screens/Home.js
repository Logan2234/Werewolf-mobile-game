import { useEffect, useState } from 'react';
import { View, BackHandler, Alert, StatusBar, Vibration } from 'react-native';
import { commonStyles } from '../constants/style';
import { vues } from '../constants/screens';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import CreateSessionForm from './CreateSessionForm';
import JoinSession from './JoinSession';
import CreateOrJoin from './CreateOrJoin';
import ShareSession from './ShareSession';
import { backgroundColor } from '../constants/colors';
import GameView from './GameView';

export default function Home() {
    const [token, setToken] = useState(null);
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [idSession, setIdSession] = useState('');
    const [currentVue, setCurrentVue] = useState(vues.LOGIN);

    useEffect(() => {
        const backActionHandler = () => {
            if (currentVue === vues.CREATE_OR_JOIN) {
                Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?',
                    [
                        { text: 'Non', onPress: () => null, style: 'default' },
                        { text: 'Oui', onPress: () => { setToken(null); setPassword(''); setCurrentVue(vues.LOGIN); }, style: 'destructive' },
                    ],
                );
            } else if (currentVue === vues.LOGIN || currentVue === vues.REGISTER) {
                Alert.alert('Quitter', 'Voulez-vous vraiment vraiment quitter ?',
                    [
                        { text: 'Non', onPress: () => null, style: 'default' },
                        { text: 'Oui', onPress: () => BackHandler.exitApp(), style: 'destructive' },
                    ],
                );
            } else if (currentVue === vues.CREATE_SESSION || currentVue === vues.JOIN_SESSION) {
                setCurrentVue(vues.CREATE_OR_JOIN);
            }
            Vibration.vibrate(10);
            return true;
        };

        BackHandler.addEventListener('backButtonPressed', backActionHandler);
        return () => BackHandler.removeEventListener('backButtonPressed', backActionHandler);

    }, [currentVue]);

    // TODO : faire attention au cas où une session lui est déjà attribuée pour un token donné
    return (<View style={commonStyles.container}>
        {

            (currentVue === vues.LOGIN)
                ? <LoginForm setToken={setToken} setIdSession={setIdSession} pseudo={pseudo} setPseudo={setPseudo} password={password} setPassword={setPassword} changeView={setCurrentVue} />
                : (currentVue === vues.REGISTER)
                    ? <RegisterForm setToken={setToken} pseudo={pseudo} setPseudo={setPseudo} password={password} setPassword={setPassword} changeView={setCurrentVue} />
                    : (currentVue === vues.CREATE_OR_JOIN)
                        ? <CreateOrJoin changeView={setCurrentVue} />
                        : (currentVue === vues.JOIN_SESSION)
                            ? <JoinSession idSession={idSession} token={token} setIdSession={setIdSession} changeView={setCurrentVue} />
                            : (currentVue === vues.CREATE_SESSION)
                                ? <CreateSessionForm setIdSession={setIdSession} changeView={setCurrentVue} token={token} />
                                : (currentVue === vues.SHARE_SESSION)
                                    ? <ShareSession idSession={idSession} token={token} />
                                    : <GameView />
        }
        <StatusBar animated={true} barStyle='default' backgroundColor={backgroundColor} />
    </View>);
}
