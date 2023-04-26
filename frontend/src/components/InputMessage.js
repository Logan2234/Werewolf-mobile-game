//InputMesssage.js
import { useState } from "react";
import { TextInput, StyleSheet, View, Alert } from "react-native";
import { secondaryColor, textColor, placeholderColor } from "../constants/colors";
import { primaryColor } from "../constants/colors";
import { Icon } from "@rneui/base";
import { BACKEND } from "../constants/backend";

export default function InputMessage({token, idDiscussion, idSession}){
    const [text, setText]=useState('');

    /**
     * Requête qui envoie le message au serveur et nettoyer l'entrée une fois fait
     * TODO : A tester -> requete a priori ok mais reste à tester efficacement
     */
    function sendMessage(){
        console.log('Message en cours d\'envoi : ', text);
        if (text != null){
            fetch(`${BACKEND}/game/${idSession}/messages/${idDiscussion}`, {
                method: 'POST',
                headers: {'x-access-token': token,
                         'Content-Type': 'application/json' },
                body: JSON.stringify({ data: '{"message": "' + text + '"}' })
            })
            .then (() => {setText('');
                        console.log('Message envoyé')})
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
            value={text}
            onChangeText={setText}
            />
            <Icon
                style={styles.button}
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
        width: '95%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: secondaryColor,
        left: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        paddingLeft: 10,
        margin: 2
    },
    input: {
        borderWidth:0,
        width:'100%',
        margin: 10,
        color: textColor,
        fontSize: 15
    },
    button: {
        margin:5
    }
})