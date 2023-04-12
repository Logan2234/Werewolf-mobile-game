import { StyleSheet, View } from 'react-native';
import { commonStyles } from '../constants/style';
import { vues } from '../constants/screens';
import Bouton from '../components/Bouton';

export default function JoinSession({ changeView }) {
    return (
        <View style={[commonStyles.container, styles.container]}>
            <Bouton onPress={() => changeView(vues.CREATE_SESSION)} style={styles.bouton} label='Créer une partie' labelSize={30} />
            <Bouton onPress={() => changeView(vues.JOIN_SESSION)} style={styles.bouton} label='Rejoindre une partie' labelSize={30} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' },
    bouton: { borderRadius: 20, padding: 50, width: 300},
});