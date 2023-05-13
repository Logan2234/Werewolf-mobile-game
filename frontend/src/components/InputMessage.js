//InputMesssage.js
import { Icon } from '@rneui/base';
import { useContext, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { BACKEND } from '../constants/backend';
import { placeholderColor, primaryColor, secondaryColor, textColor } from '../constants/colors';
import { TokenContext } from '../constants/hooks';

/**
 * Champ en bas de discussion qui va permettre d'écrire et envoyer des messages pour une session et une discussion donnée.
 * 
 * @param {string} idDiscussion correspond au salon souhaité, peut être 'place', 'repere' ou 'spiritisme'
 * @param {string} idSession correspond à l'id de la session pour laquelle on souhaite accéder aux discssion (code à 6 chiffre attendu)
 * @param {*} ws websocket associé pour actualiser le fil de discussion
 * @returns Elément JSX
 */
export default function InputMessage({ idDiscussion, idSession, ws }) {
    const [text, setText] = useState('');
    const token = useContext(TokenContext).token;

    /**
     * Requête qui envoie le message au serveur et nettoyer l'entrée une fois fait
     */
    function sendMessage() {
        if (text != '') {
            fetch(`${BACKEND}/game/${idSession}/messages/${idDiscussion}`, {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: '{"message": "' + text + '"}' })
            }).catch(error => alert('Message non envoyé') + error);

            fetch(`${BACKEND}/whoami`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => { return data.username; })
                .then(username => ws.send(JSON.stringify({ idSession: idSession, username: username, idDiscussion: idDiscussion, message: text })))
                .then(() => setText(''))
                .catch(error => alert('Message non envoyé') + error);
        }
    }

    /**
     * Renvoyer un affichage sympatique pour l'entrée de texte
     */
    return (
        <View style={styles.field}>
            <TextInput placeholder="Message"
                placeholderTextColor={placeholderColor}
                style={styles.input}
                value={text}
                onChangeText={setText}
                onSubmitEditing={() => sendMessage()}
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
    field: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: secondaryColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
    },

    input: {
        paddingLeft: 10,
        height: '100%',
        width: '90%',
        color: textColor,
        fontSize: 15
    },

    button: {
        margin: 6,
    }
});