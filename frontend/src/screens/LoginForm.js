import { View, Pressable, Alert } from 'react-native';
import { loginAndRegisterStyle as styles } from '../constants/constants';
import { commonStyles } from '../constants/style';
import { BACKEND } from '../constants/backend';
import { vues } from '../constants/screens';
import Bouton from '../components/Bouton';
import Title from '../components/Title';
import SizedText from '../components/SizedText';
import Field from '../components/Field';
import { errorCodes } from '../constants/errorCode';

export default function LoginForm({ changeView, setToken, pseudo, setPseudo, password, setPassword }) {        
    function connect() {
        fetch(`${BACKEND}/login`, {
            method: 'POST',
            body: new URLSearchParams({ 'data': '{"username": "' + pseudo + '","password": "' + password + '"}' })

        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    setToken(data.token);
                    changeView(vues.CREATE_OR_JOIN);
                } else {
                    Alert.alert(errorCodes.UNABLE_TO_CONNECT, data.message);
                    alert(data.message);
                }
            })
            .catch(error => alert('Server error: ' + error));
    }

    //TODO : mettre le bouton "Se connecter" en onPress quadn on appuie sur entrée
    return (
        <View style={[styles.form, commonStyles.container]}>
            <Title style={styles.header} label='Connexion' />

            <View style={styles.fields}>
                <Field nativeID='pseudoInput' value={pseudo} setFunction={setPseudo} placeholder='Pseudo' />
                <Field nativeID='passwordInput' value={password} setFunction={setPassword} placeholder='Mot de passe' secureTextEntry={true} />
                <Bouton nativeID='connect' label='Se connecter' onPress={() => connect(pseudo, password)} />
            </View>

            <View style={styles.footer}>
                <SizedText label='Pas encore inscrit ? ' size={17} />
                <Pressable onPress={() => changeView(vues.REGISTER)}>
                    <SizedText style={commonStyles.link} size={17} label='Inscrivez-vous!' />
                </Pressable>
            </View>
        </View>
    );
}
