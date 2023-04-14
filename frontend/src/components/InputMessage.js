//InputMesssage.js
import { TextInput, StyleSheet, View } from "react-native";
import { secondaryColor, textColor, placeholderColor } from "../constants/colors";
import { commonStyles } from "../constants/style";

export default function InputMesssage({token, idDiscussion}){

    /**
     * TODO : Requête qui envoie le message au serveur et nettoyer l'entrée une fois fait
     */
    function sendMessage(){

    }

    /**
     * TODO : Renvoyer un affichage sympatique pour l'entrée de texte
     */
    return (
        <View style={styles.bottom}>
            <TextInput placeholder="Message"
            placeholderTextColor={placeholderColor}
            style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        left: 0
    },
    input: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 10,
        margin: 10,
        borderRadius: 5,
        borderColor: secondaryColor,
        color: textColor,
        fontSize: 15
    }
})