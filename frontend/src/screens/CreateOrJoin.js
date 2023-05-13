import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Bouton from '../components/Bouton';
import { ScreenContext } from '../constants/hooks';
import { views } from '../constants/screens';
import { commonStyles } from '../constants/style';

/**
 * Vue qui gère l'accès aux parties (pour créer ou rejoindre)
 * 
 * @returns 
 */
export default function JoinSession() {
    const changeView = useContext(ScreenContext);

    return (
        <View style={[commonStyles.container, styles.container]}>
            <Bouton onPress={() => changeView(views.CREATE_SESSION)} style={styles.bouton} label='Créer une partie' labelSize={30} />
            <Bouton onPress={() => changeView(views.JOIN_SESSION)} style={styles.bouton} label='Rejoindre une partie' labelSize={30} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' },
    bouton: { borderRadius: 20, padding: 50, width: 300},
});