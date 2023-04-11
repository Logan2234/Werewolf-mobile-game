import { StyleSheet, View } from 'react-native';
import { commonStyles } from '../constants/style';
import Bouton from '../components/Bouton';

export default function JoinSession({onClick}) {
    return (
        <View style={[styles.container, commonStyles.container]}>
            <Bouton onPress={() => onClick(0)} style={styles.bouton} label={'Créer une partie'} labelSize='30'/>
            <Bouton onPress={() => onClick(1)} style={styles.bouton} label={'Rejoindre une partie'} labelSize='30'/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'center', gap: 50, alignItems: 'center' },
    bouton: { height: '12%', width: '75%', borderRadius: 20},
});