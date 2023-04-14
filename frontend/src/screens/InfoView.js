import { StyleSheet, View } from 'react-native';
import SizedText from '../components/SizedText';
import Bouton from '../components/Bouton';
import { commonStyles } from '../constants/style';
import Title from '../components/Title';
import { useContext } from 'react';
import { DataContext } from './GameView';

export default function InfoView() {
    const users = useContext(DataContext);

    return (
        <View style={[commonStyles.container, styles.infoView]}>
            <Title style={styles.title} label='Jour' />
            <View style={styles.status}>
                <SizedText label={`Rôle: ${users.role}`}/>
                <SizedText label={`Pouvoir: ${users.pouvoir}`}/>
                <SizedText label={`Vie: ${users.vie}`}/>
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
    title:{
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
