import { useContext, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import Bouton from '../components/Bouton';
import Field from '../components/Field';
import SizedText from '../components/SizedText';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { loginAndRegisterStyle as styles } from '../constants/constants';
import { errorCodes } from '../constants/errorCode';
import { ScreenContext, TokenContext } from '../constants/hooks';
import { views } from '../constants/screens';
import { commonStyles } from '../constants/style';

export default function LoginForm({ setIdSession }) {
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    
    const changeView = useContext(ScreenContext);
    const setToken = useContext(TokenContext).setToken;

    async function selectCorrectView(token) {
        await fetch(`${BACKEND}/user/game`, {
            method: 'GET',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response1 => response1.json())
            .then(data2 => {
                if (data2.idSession) {
                    setIdSession(data2.idSession);
                    changeView(views.SHARE_SESSION);
                } else if (data2.idGame) {
                    setIdSession(data2.idGame);
                    changeView(views.IN_GAME);
                } else {
                    changeView(views.CREATE_OR_JOIN);
                }
            })
            .catch(error => alert('Server error: ' + error));
    }

    async function connect() {
        await fetch(`${BACKEND}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: '{"username": "' + pseudo + '","password": "' + password + '"}' })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    setToken(data.token);
                } else
                    Alert.alert(errorCodes.UNABLE_TO_CONNECT, data.message);
                return data.token;
            }).then((token) => { if (token) selectCorrectView(token); })
            .catch(error => alert('Server error: ' + error));
    }

    // TODO: Enter on first field goes to the second one
    return (
        <View style={[styles.form, commonStyles.container]}>
            <Title style={styles.header} label='Connexion' />

            <View style={styles.fields}>
                <Field nativeID='pseudoInput' value={pseudo} onChangeText={setPseudo} placeholder='Pseudo' />
                <Field nativeID='passwordInput' value={password} onChangeText={setPassword} placeholder='Mot de passe' secureTextEntry={true} onSubmitEditing={connect} />
                <Bouton nativeID='connect' label='Se connecter' onPress={connect} />
            </View>

            <View style={styles.footer}>
                <SizedText label='Pas encore inscrit ? ' size={17} />
                <Pressable onPress={() => changeView(views.REGISTER)}>
                    <SizedText style={commonStyles.link} size={17} label='Inscrivez-vous!' />
                </Pressable>
            </View>
        </View>
    );
}
