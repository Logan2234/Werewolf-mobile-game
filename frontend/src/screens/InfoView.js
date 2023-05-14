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
import ChoixContamination from './Contamination';
import ChoixSpiritisme from './Spiritisme';
import ChoixVoyance from './Voyance';

/**
 * Vue qui va afficher les informations de la partie et permettre d'utiliser son pouvoir.
 *
 * @param {int} idSession
 * @returns
 */
export default function InfoView({ idSession }) {
    const [alivePlayers, setAlivePlayers] = useState({});
    const [deadPlayers, setDeadPlayers] = useState({});
    const [userData, setUserData] = useState({});
    const [gameData, setGameData] = useState({});
    const [aliveWerewolves, setAliveWerewolves] = useState(0);
    const [timeUntilNextStage, setTimeUntilNextStage] = useState(0);
    const [canShow, setCanShow] = useState(false);
    const [currentJSX, setJSX] = useState(null);
    const [timeoutOn, setTimeoutOn] = useState(false);
    const [usePower, setUsePower] = useState(false);

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

        function fetchTimeUntilNextStage() {
            fetch(`${BACKEND}/game/${idSession}/time`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => setTimeUntilNextStage(data.timeLeft))
                .catch(error => alert(error.message));
        }

        function fetchAliveWerewolves() {
            fetch(`${BACKEND}/game/${idSession}/werewolves`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => setAliveWerewolves(data.nbWerewolves))
                .then(() => setCanShow(true))
                .then(() => { if (!timeoutOn) { setTimeout(fetchEverything, 1000); setTimeoutOn(true); } }) // To limitate the number of timeouts
                .catch(error => alert(error.message));
        }

        function fetchEverything() {
            fetchAliveData();
            fetchDeadData();
            fetchUserData();
            fetchGameData();
            fetchTimeUntilNextStage();
            fetchAliveWerewolves();
        }

        if (currentGameView == gameViews.INFO) {
            setCanShow(false);
            fetchEverything();
        }

    }, [currentGameView, idSession, token, timeoutOn]);

    useEffect(() => {
        let pouvoir;
        let onPress;
        switch (userData.pouvoir) {
            case 'V':
                pouvoir = 'Voyance';
                onPress = () => { 
                    setUsePower(true);
                    setJSX(<ChoixVoyance idSession={idSession} />); };
                break;
            case 'S':
                pouvoir = 'Spiritisme';
                onPress = () => { 
                    setUsePower(true);
                    setJSX(<ChoixSpiritisme idSession={idSession} />); };
                break;
            case 'I':
                pouvoir = 'Insomnie'; break;
            case 'C':
                pouvoir = 'Contamination';
                onPress = () => { 
                    setUsePower(true);
                    setJSX(<ChoixContamination idSession={idSession} />); };
                break;
            default:
                pouvoir = 'Aucun'; break;
        }

        if (alivePlayers.length == aliveWerewolves)
            setJSX(<Title label='Les loups-garous ont gagné !' />);
        else if (aliveWerewolves == 0)
            setJSX(<Title label='Les villageois ont gagné !' />);
        else if (usePower === false)
            setJSX(
                <View style={[commonStyles.container, styles.infoView]}>
                    {
                        (canShow)
                            ? <>
                                <Title label={(gameData.moment == 'N') ? 'Nuit' : 'Jour'} />
                                <View style={styles.status}>
                                    <SizedText label={`Rôle: ${(userData.role == 'V') ? 'Villageois' : 'Loup-garou'}`} />
                                    <SizedText label={`Pouvoir: ${pouvoir}`} />
                                    <SizedText label={`Vie: ${(userData.vie == 'V') ? 'Vivant' : 'Mort'}`} />
                                </View>

                                <View style={styles.time}>
                                    <SizedText label={'Durée jour: ' + ((Math.floor(gameData.dureeJour / 60000 / 60) != 0) ? `${Math.floor(gameData.dureeJour / 60000 / 60)}h` : '') + ((gameData.dureeJour / 60000 % 60 != 0) ? `${gameData.dureeJour / 60000 % 60}min` : '')} />
                                    <SizedText label={'Durée nuit: ' + ((Math.floor(gameData.dureeNuit / 60000 / 60) != 0) ? `${Math.floor(gameData.dureeNuit / 60000 / 60)}h` : '') + ((gameData.dureeNuit / 60000 % 60 != 0) ? `${gameData.dureeNuit / 60000 % 60}min` : '')} />
                                    <SizedText label={'Prochain jour: ' + ((gameData.moment == 'J')
                                        ? `${Math.floor((timeUntilNextStage + gameData.dureeNuit) / 1000 / 60 / 60)}:`
                                        + `${Math.floor((timeUntilNextStage + gameData.dureeNuit) / 1000 / 60 % 60)}:`
                                        + `${Math.ceil((timeUntilNextStage + gameData.dureeNuit) / 1000 % 60)}`
                                        : `${Math.floor(timeUntilNextStage / 1000 / 60 / 60)}:`
                                        + `${Math.floor(timeUntilNextStage / 1000 / 60 % 60)}:`
                                        + `${Math.ceil(timeUntilNextStage / 1000 % 60)}`)} />
                                    <SizedText label={'Prochaine nuit: ' + ((gameData.moment == 'N')
                                        ? `${Math.floor((timeUntilNextStage + gameData.dureeJour) / 1000 / 60 / 60)}:`
                                        + `${Math.floor((timeUntilNextStage + gameData.dureeJour) / 1000 / 60 % 60)}:`
                                        + `${Math.ceil((timeUntilNextStage + gameData.dureeJour) / 1000 % 60)}`
                                        : `${Math.floor(timeUntilNextStage / 1000 / 60 / 60)}:`
                                        + `${Math.floor(timeUntilNextStage / 1000 / 60 % 60)}:`
                                        + `${Math.ceil(timeUntilNextStage / 1000 % 60)}`)} />
                                    <SizedText label={'Temps actuel: ' + new Date().toLocaleString('fr-FR')} />
                                </View>

                                <View style={styles.gameStatus}>
                                    <SizedText label={`Nombre de joueurs vivants: ${alivePlayers.length} / ${alivePlayers.length + deadPlayers.length}`} />
                                    <SizedText label={`Nombre de loups-garous: ${aliveWerewolves} / ${gameData.nbLG}`} />
                                </View>
                                {
                                    ((userData.pouvoir === 'V' || userData.pouvoir === 'C' || userData.pouvoir === 'S') && userData.vie === 'V')
                                        ? <Bouton style={styles.bouton} label='Utiliser pouvoir' onPress={onPress} />
                                        : null
                                }
                            </>
                            : <ActivityIndicator style={{ height: '100%' }} size={100} color={primaryColor} />
                    }
                </View>
            );
    }, [currentGameView, alivePlayers, idSession, aliveWerewolves, canShow, deadPlayers, gameData, userData, timeUntilNextStage, usePower]);

    return (
        <View style={styles.container}>{currentJSX}</View>
    );
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
    },
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    }
});
