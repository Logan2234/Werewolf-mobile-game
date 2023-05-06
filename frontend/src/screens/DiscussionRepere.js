import { StyleSheet, View } from "react-native";
import Discussion from "../components/Discussion";
import Title from "../components/Title";


export default function DiscussionRepere({ idSession }) {
    // TODO : rajouter la liste des loups-garous dans un menu dépliant pour savoir avec qui on est
    return(
        <View style={styles.container}>
            <Title label='Repère des Loups-Garous' />
            <Discussion idDiscussion={'repere'} idSession={idSession} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between'
      },

})