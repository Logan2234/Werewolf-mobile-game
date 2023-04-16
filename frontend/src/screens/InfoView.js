import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Bouton from '../components/Bouton';
import SizedText from '../components/SizedText';
import Title from '../components/Title';
import { GameData } from '../constants/hooks';
import { commonStyles } from '../constants/style';

export default function InfoView() {
    const gameData = useContext(GameData);

    const dayOrNight = (gameData.gameData.gameInfo.moment === 'N') ? 'Nuit' : 'Jour';

    const role = (gameData.userData.role === 'V') ? 'Villageois' : 'Loup-garou';
    let pouvoir;
    switch (gameData.userData.pouvoir) {
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
    const vie = (gameData.userData.vie === 'V') ? 'Vivant' : 'Mort';

    const alivePlayers = (gameData.alivePlayers.aliveUsers !== undefined) ? gameData.alivePlayers.aliveUsers.length : null;
    const nbLG = gameData.gameData.gameInfo.nbLG;
    console.log(gameData.gameData);

    return (
        <View style={[commonStyles.container, styles.infoView]}>
            <Title style={styles.title} label={dayOrNight} />
            <View style={styles.status}>
                <SizedText label={`Rôle: ${role}`} />
                <SizedText label={`Pouvoir: ${pouvoir}`} />
                <SizedText label={`Vie: ${vie}`} />
            </View>

            <View style={styles.time}>
                <SizedText label='Prochain jour: ' />
                <SizedText label='Prochaine nuit: ' />
                <SizedText label='Temps actuel: ' />
                <SizedText label='Temps de jeu: ' />
            </View>

            <View style={styles.gameStatus}>
                <SizedText label={`Nombre de joueurs vivants: ${alivePlayers}`} />
                <SizedText label={`Nombre de loups-garou restants: ${nbLG}`} />
            </View>
            {
                (gameData.userData.role !== 'R' && gameData.userData.vivant === 'V')
                    ? <Bouton style={styles.bouton} label='Utiliser pouvoir' />
                    : null
            }
        </View >);
}

const styles = StyleSheet.create({
    title: {
        backgroundColor: 'grey',
    },
    infoView: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    status: {
        backgroundColor: 'red',
        display: 'flex',
        gap: 20
    },
    time: {
        backgroundColor: 'green',
        display: 'flex',
        gap: 20
    },
    gameStatus: {
        backgroundColor: 'purple',
        display: 'flex',
        gap: 20
    }
});
