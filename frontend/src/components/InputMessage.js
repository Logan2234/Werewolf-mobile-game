//InputMesssage.js
import { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { secondaryColor, textColor, placeholderColor } from "../constants/colors";
import { commonStyles } from "../constants/style";

export default function InputMesssage({token, idDiscussion, idGame}){
    const [text, setText]=useState(null);

    /**
     * TODO : Requête qui envoie le message au serveur et nettoyer l'entrée une fois fait
     */
    function sendMessage(){
        fetch(`${BACKEND}/inGame/${idGame}/messages/${idDiscussion}`, {
            method: 'POST',
            headers: {'x-access-token':token,
                     'Content-Type': 'application/json' },
            body: JSON.stringify({ data: '{"message": "' + text + '"}' })
        })
        .then (() => {setText(null);})
        .catch( error =>
            {alert('Message non envoyé');})
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