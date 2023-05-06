//InputMesssage.js
import { Icon } from '@rneui/base';
import { useContext, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { BACKEND } from '../constants/backend';
import { placeholderColor, primaryColor, secondaryColor, textColor } from '../constants/colors';
import { TokenContext } from '../constants/hooks';
import { commonStyles } from '../constants/style';


export default function InputMessage({ idDiscussion, idSession }) {
    const [text, setText]=useState('');
    const token = useContext(TokenContext).token;

    /**
     * Requête qui envoie le message au serveur et nettoyer l'entrée une fois fait
     */
    function sendMessage(){
        console.log('Message en cours d\'envoi : ', text);
        if (text != null){
            fetch(`${BACKEND}/game/${idSession}/messages/${idDiscussion}`, {
                method: 'POST',
                headers: {'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: '{"message": "' + text + '"}' })
            })
                .then(() => {
                    setText('');
                    console.log('Message envoyé');
                })
                .catch(error =>
                {alert('Message non envoyé') + error;});
        }
    }

    /**
     * Renvoyer un affichage sympatique pour l'entrée de texte
     */
    return (
        <View style={[commonStyles.bottom, styles.field]}>
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
    field: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: secondaryColor,
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
});