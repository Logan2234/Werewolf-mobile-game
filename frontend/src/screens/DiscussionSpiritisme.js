import { StyleSheet, View } from 'react-native';
import Discussion from '../components/Discussion';
import Title from '../components/Title';


export default function DiscussionSpiritisme({ idGame }) {

    // TODO : rajouter à quelle personne on parle (le spiritiste ou le mort)
    return(
        <View style={styles.container}>
            <Title label='Salle de spiritisme' />
            <Discussion idDiscussion={'place'} idGame={idGame} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
});
