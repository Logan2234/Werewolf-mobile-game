import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Bouton from '../components/Bouton';
import SizedText from '../components/SizedText';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { primaryColor } from '../constants/colors';
import { CurrentGameView, TokenContext } from '../constants/hooks';
import { gameViews } from '../constants/screens';
import { commonStyles } from '../constants/style';

export default function InfoView({ idSession }) {
    const [alivePlayers, setAlivePlayers] = useState({});
    const [deadPlayers, setDeadPlayers] = useState({});
    const [userData, setUserData] = useState({});
    const [gameData, setGameData] = useState({});
    const [aliveWerewolves, setAliveWerewolves] = useState(0);
    const [canShow, setCanShow] = useState(false);

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    useEffect(() => {
        function fetchAliveData() {
            fetch(`${BACKEND}/game/${idSession}/alives`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => setAlivePlayers(data.aliveUsers))
                .catch(error => alert(error.message));
        }

        function fetchDeadData() {
            fetch(`${BACKEND}/game/${idSession}/deads`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => setDeadPlayers(data.deadUsers))
                .catch(error => alert(error.message));
        }

        function fetchUserData() {
            fetch(`${BACKEND}/user/status`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => setUserData(data))
                .catch(error => alert(error.message));
        }

        function fetchGameData() {
            fetch(`${BACKEND}/game/${idSession}/info`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => setGameData(data.gameInfo))
                .catch(error => alert(error.message));
        }

        function fetchAliveWerewolves() {
            fetch(`${BACKEND}/game/${idSession}/werewolves`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => setAliveWerewolves(data.nbWerewolfs))
                .then(() => setCanShow(true))
                .catch(error => alert(error.message));
        }

        if (currentGameView == gameViews.INFO) {
            setCanShow(false);
            fetchAliveData();
            fetchDeadData();
            fetchUserData();
            fetchGameData();
            fetchAliveWerewolves();
        }
    }, [currentGameView, idSession, token]);

    let pouvoir;
    switch (userData.pouvoir) {
        case 'V':
            pouvoir = 'Voyance'; break;
        case 'S':
            pouvoir = 'Spiritisme'; break;
        case 'I':
            pouvoir = 'Insomnie'; break;
        case 'C':
            pouvoir = 'Contamination'; break;
        default:
            pouvoir = 'Aucun'; break;
    }

    return (
        <View style={[commonStyles.container, styles.infoView]}>
            {
                (canShow)
                    ? <>
                        <Title label={(gameData.moment === 'N') ? 'Nuit' : 'Jour'} />
                        <View style={styles.status}>
                            <SizedText label={`Rôle: ${(userData.role === 'V') ? 'Villageois' : 'Loup-garou'}`} />
                            <SizedText label={`Pouvoir: ${pouvoir}`} />
                            <SizedText label={`Vie: ${(userData.vie === 'V') ? 'Vivant' : 'Mort'}`} />
                        </View>

                        <View style={styles.time}>
                            <SizedText label={`Durée jour: ${gameData.dureeJour / 60}h` + ((gameData.dureeJour % 60 != 0) ? `${gameData.dureeJour % 60}mins` : '')} />
                            <SizedText label={`Durée nuit: ${gameData.dureeNuit / 60}h` + ((gameData.dureeNuit % 60 != 0) ? `${gameData.dureeNuit % 60}mins` : '')} />
                            <SizedText label='Prochain jour: ' />
                            <SizedText label='Prochaine nuit: ' />
                            <SizedText label='Temps actuel: ' />
                            <SizedText label='Temps de jeu: ' />
                        </View>

                        <View style={styles.gameStatus}>
                            <SizedText label={`Nombre de joueurs vivants: ${alivePlayers.length} / ${alivePlayers.length + deadPlayers.length}`} />
                            <SizedText label={`Nombre de loups-garou: ${aliveWerewolves} / ${gameData.nbLG}`} />
                        </View>
                        {
                            (userData.role !== 'R' && userData.vivant === 'V')
                                ? <Bouton style={styles.bouton} label='Utiliser pouvoir' />
                                : null
                        }
                    </>
                    : <ActivityIndicator style={{ height: '100%' }} size={100} color={primaryColor} />
            }
        </View >);
}

const styles = StyleSheet.create({
    infoView: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    status: {
        display: 'flex',
        alignItems: 'center',
        gap: 20
    },
    time: {
        display: 'flex',
        alignItems: 'center',
        gap: 20
    },
    gameStatus: {
        display: 'flex',
        alignItems: 'center',
        gap: 20
    }
});
