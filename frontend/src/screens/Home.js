import { useEffect, useState } from 'react';
import { Alert, BackHandler, StatusBar, Vibration, View } from 'react-native';
import { backgroundColor } from '../constants/colors';
import { ScreenContext, TokenContext } from '../constants/hooks';
import { vues } from '../constants/screens';
import { commonStyles } from '../constants/style';
import CreateOrJoin from './CreateOrJoin';
import CreateSessionForm from './CreateSessionForm';
import GameView from './GameView';
import JoinSession from './JoinSession';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ShareSession from './ShareSession';

export default function Home() {
    const [token, setToken] = useState(null);
    const [idSession, setIdSession] = useState('');
    const [currentView, setCurrentView] = useState(vues.LOGIN);
    const [currentViewJSX, setCurrentViewJSX] = useState(null);

    useEffect(() => {
        function setJSX() {
            switch (currentView) {
            case vues.LOGIN:
                setCurrentViewJSX(<LoginForm setIdSession={setIdSession} />); break;
            case vues.REGISTER:
                setCurrentViewJSX(<RegisterForm />); break;
            case vues.CREATE_OR_JOIN:
                setCurrentViewJSX(<CreateOrJoin />); break;
            case vues.JOIN_SESSION:
                setCurrentViewJSX(<JoinSession idSession={idSession} setIdSession={setIdSession} />); break;
            case vues.CREATE_SESSION:
                setCurrentViewJSX(<CreateSessionForm setIdSession={setIdSession} />); break;
            case vues.SHARE_SESSION:
                setCurrentViewJSX(<ShareSession idSession={idSession} />); break;
            case vues.IN_GAME:
                setCurrentViewJSX(<GameView />); break;
            }
        }

        const backActionHandler = () => {
            if (currentView === vues.CREATE_OR_JOIN) {
                Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?',
                    [
                        { text: 'Non', onPress: () => null, style: 'default' },
                        { text: 'Oui', onPress: () => { setToken(null); setCurrentView(vues.LOGIN); }, style: 'destructive' },
                    ],
                );
            } else if (currentView === vues.LOGIN || currentView === vues.REGISTER) {
                Alert.alert('Quitter', 'Voulez-vous vraiment vraiment quitter ?',
                    [
                        { text: 'Non', onPress: () => null, style: 'default' },
                        { text: 'Oui', onPress: () => BackHandler.exitApp(), style: 'destructive' },
                    ],
                );
            } else if (currentView === vues.CREATE_SESSION || currentView === vues.JOIN_SESSION) {
                setCurrentView(vues.CREATE_OR_JOIN);
            }
            Vibration.vibrate(10);
            return true;
        };
        BackHandler.addEventListener('backButtonPressed', backActionHandler);
        setJSX();
        return () => BackHandler.removeEventListener('backButtonPressed', backActionHandler);
    }, [currentView, idSession]);

    return (
        <View style={commonStyles.container}>
            <ScreenContext.Provider value={setCurrentView}>
                <TokenContext.Provider value={{ setToken, token }}>
                    {currentViewJSX}
                </TokenContext.Provider>
            </ScreenContext.Provider>
            <StatusBar animated={true} barStyle='default' backgroundColor={backgroundColor} />
        </View>);
}
