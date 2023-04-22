import { useEffect, useState } from 'react';
import { Alert, BackHandler, StatusBar, Vibration, View } from 'react-native';
import { backgroundColor } from '../constants/colors';
import { ScreenContext, TokenContext } from '../constants/hooks';
import { views } from '../constants/screens';
import { commonStyles } from '../constants/style';
import CreateOrJoin from './CreateOrJoin';
import CreateSessionForm from './CreateSessionForm';
import GameView from './GameView';
import JoinSession from './JoinSession';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ShareSession from './ShareSession';
import DiscussionVillage from './DiscussionVillage';

export default function Home() {
    const [token, setToken] = useState(null);
    const [idSession, setIdSession] = useState('');
    const [currentView, setCurrentView] = useState(views.LOGIN);
    const [currentViewJSX, setCurrentViewJSX] = useState(null);

    useEffect(() => {
        function setJSX() {
            switch (currentView) {
            case views.LOGIN:
                setCurrentViewJSX(<LoginForm setIdSession={setIdSession} />); break;
            case views.REGISTER:
                setCurrentViewJSX(<RegisterForm />); break;
            case views.CREATE_OR_JOIN:
                setCurrentViewJSX(<CreateOrJoin />); break;
            case views.JOIN_SESSION:
                setCurrentViewJSX(<JoinSession idSession={idSession} setIdSession={setIdSession} />); break;
            case views.CREATE_SESSION:
                setCurrentViewJSX(<CreateSessionForm setIdSession={setIdSession} />); break;
            case views.SHARE_SESSION:
                setCurrentViewJSX(<ShareSession idSession={idSession} />); break;
            case views.IN_GAME:
                setCurrentViewJSX(<GameView idSession={idSession} />); break;
            }
        }

        const backActionHandler = () => {
            if (currentView === views.LOGIN || currentView === views.REGISTER) {
                Alert.alert('Quitter', 'Voulez-vous vraiment vraiment quitter ?',
                    [
                        { text: 'Non', onPress: () => null, style: 'default' },
                        { text: 'Oui', onPress: () => BackHandler.exitApp(), style: 'destructive' },
                    ],
                );
            } else if (currentView === views.CREATE_SESSION || currentView === views.JOIN_SESSION)
                setCurrentView(views.CREATE_OR_JOIN);
            else {
                Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?',
                    [
                        { text: 'Non', onPress: () => null, style: 'default' },
                        { text: 'Oui', onPress: () => { setToken(null); setCurrentView(views.LOGIN); }, style: 'destructive' },
                    ],
                );
            }
            Vibration.vibrate(10);
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', backActionHandler);
        setJSX();
        return () => BackHandler.removeEventListener('hardwareBackPress', backActionHandler);
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
