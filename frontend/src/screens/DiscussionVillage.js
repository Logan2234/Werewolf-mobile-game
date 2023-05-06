import { StyleSheet, View } from "react-native";
import Discussion from "../components/Discussion";
import Title from "../components/Title";

export default function DiscussionVillage({ idGame }) {
    return(
        <View style={styles.container}>
            <Title label='Place du village' />
            <Discussion idDiscussion={'place'} idGame={idGame} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

})