import Discussion from "../components/Discussion";
import Title from "../components/Title";
import { View, StyleSheet } from "react-native";


export default function DiscussionRepere({ token, idSession }) {

    // TODO : rajouter la liste des loups-garous pour savoir avec qui on est
    return(
        <View style={styles.container}>
            <Title label='Repère des Loups-Garous' />
            <Discussion token={token} idDiscussion={'repere'} idSession={idSession}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
    
})