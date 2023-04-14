import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Bouton from '../components/Bouton';
import SizedText from '../components/SizedText';
import Title from '../components/Title';
import { InGameUserDataContext } from '../constants/hooks';
import { commonStyles } from '../constants/style';

export default function InfoView() {
    const usersData = useContext(InGameUserDataContext);

    const role = (usersData.role === 'V') ? 'Villageois' : 'Loup-garou';
    let pouvoir;
    switch (usersData.pouvoir) {
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
    const vie = (usersData.vie === 'V') ? 'Vivant' : 'Mort';

    return (
        <View style={[commonStyles.container, styles.infoView]}>
            <Title style={styles.title} label='Jour' />
            <View style={styles.status}>
                <SizedText label={`Rôle: ${role}`} />
                <SizedText label={`Pouvoir: ${pouvoir}`} />
                <SizedText label={`Vie: ${vie}`} />
            </View>

            <View style={styles.time}>
                <SizedText label='Début du jour: ' />
                <SizedText label='Début de la nuit: ' />
                <SizedText label='Temps actuel: ' />
            </View>

            <View style={styles.gameStatus}>
                <SizedText label='Nombre de joueurs vivants:' />
                <SizedText label='Nombre de loups-garou restants:' />
            </View>

            <Bouton style={styles.bouton} label='Utiliser pouvoir' />
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
