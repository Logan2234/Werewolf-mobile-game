//InputMesssage.js
import { useState } from "react";
import { TextInput, StyleSheet, View, Alert } from "react-native";
import { secondaryColor, textColor, placeholderColor } from "../constants/colors";
import { primaryColor } from "../constants/colors";
import { Icon } from "@rneui/base";

export default function InputMesssage({token, idDiscussion, idGame}){
    const [text, setText]=useState(null);

    /**
     * Requête qui envoie le message au serveur et nettoyer l'entrée une fois fait
     * TODO : A tester
     */
    function sendMessage(){
        if (text != null){
            fetch(`${BACKEND}/inGame/${idGame}/messages/${idDiscussion}`, {
                method: 'POST',
                headers: {'x-access-token':token,
                         'Content-Type': 'application/json' },
                body: JSON.stringify({ data: '{"message": "' + text + '"}' })
            })
            .then (() => {setText(null);})
            .catch( error =>
                {alert('Message non envoyé') + error;});
        }
    }

    /**
     * Renvoyer un affichage sympatique pour l'entrée de texte
     * TODO : A tester
     */
    return (
        <View style={styles.bottom}>
            <TextInput placeholder="Message"
            placeholderTextColor={placeholderColor}
            style={styles.input}
            />
            <Icon
                name='send'
                type='FontAwesome'
                onPress={sendMessage}
                color={primaryColor}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: secondaryColor,
        left: 0,
        flex:1,
        flexDirection: 'row'
    },
    input: {
        borderWidth:0,
        height: 40,
        paddingLeft: 10,
        margin: 10,
        color: textColor,
        fontSize: 15
    }
})