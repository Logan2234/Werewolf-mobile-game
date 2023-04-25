import Discussion from "../components/Discussion";
import { commonStyles } from "../constants/style";
import { vues } from "../constants/screens";
import { View, StyleSheet } from "react-native";
import Title from "../components/Title";

export default function DiscussionVillage({ token, idGame }) {

    return(
        <View style={styles.container}>
            <Title label='Place du village' />
            <Discussion token={token} idDiscussion={'place'} idGame={idGame}/>
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