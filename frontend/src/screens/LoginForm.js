import { View, Pressable } from 'react-native';
import { loginAndRegisterStyle as styles } from '../constants/constants';
import { commonStyles } from '../constants/style';
import Bouton from '../components/Bouton';
import Title from '../components/Title';
import SizedText from '../components/SizedText';
import { BACKEND } from '../constants/backend';
import Field from '../components/Field';

export default function LoginForm({ changeView, setToken, pseudo, setPseudo, password, setPassword }) {
    function connect(pseudo, password) {
        fetch(`${BACKEND}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pseudo, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    setToken(data.token);
                } else { alert('Pseudo ou mot de passe incorrect'); }
            })
            .catch(error => alert('Server error: ' + error));
    }

    return (
        <View style={[styles.form, commonStyles.container]}>
            <Title style={styles.header} label='Connexion' />

            <View style={styles.fields}>
                <Field nativeID='pseudoInput' value={pseudo} setFunction={setPseudo} placeholder='Pseudo' />
                <Field nativeID='passwordInput' value={password} setFunction={setPassword} placeholder='Mot de passe' secureTextEntry={true} />
                <Bouton nativeID='connect' label='Se connecter' onPress={() => connect(pseudo, password)} />
            </View>

            <View style={styles.footer}>
                <SizedText label='Pas encore inscrit ? ' size='17' />
                <Pressable onPress={() => changeView(1)}>
                    <SizedText style={commonStyles.link} size='17' label='Inscrivez-vous!' />
                </Pressable>
            </View>
        </View >
    );
}
