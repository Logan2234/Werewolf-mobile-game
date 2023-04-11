import { Pressable, View } from 'react-native';
import { useEffect } from 'react';
import { loginAndRegisterStyle as styles } from '../constants/constants';
import { commonStyles } from '../constants/style';
import { BACKEND } from '../constants/backend';
import Bouton from '../components/Bouton';
import Title from '../components/Title';
import SizedText from '../components/SizedText';
import { useState } from 'react';
import Field from '../components/Field';
export default function RegisterForm({ changeView, setToken, pseudo, setPseudo, password, setPassword }) {
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [afficheMotDePasseDiffere, setAfficheMotDePasseDiffere] = useState(false);

    function register(pseudo, password) {
        fetch(`${BACKEND}/signin`, {
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
            .catch(error => {
                alert('Server error: ' + error);
            });
    }

    useEffect(() => {
        setAfficheMotDePasseDiffere(() => password.length > 0 && password.length == passwordConfirmation.length && passwordConfirmation !== password);
    }, [passwordConfirmation, password]);

    return (
        <View style={[styles.form, commonStyles.container]}>
            <Title style={styles.header} label='Inscription' />
            
            <View style={styles.fields}>
                <Field nativeID='pseudoInput' value={pseudo} setFunction={setPseudo} placeholder='Pseudo' />
                <Field nativeID='passwordInput' value={password} setFunction={setPassword} placeholder='Mot de passe' secureTextEntry={true} />
                <Field nativeID='passwordInputConfirmation' value={passwordConfirmation} setFunction={setPasswordConfirmation} placeholder='Confirmation du mot de passe' secureTextEntry={true} />
                {
                    (afficheMotDePasseDiffere == true) ?
                        <SizedText style={styles.error} label='Les mots de passe ne correspondent pas' size='15' />
                        : null
                }
                <Bouton nativeID='register' label='S&apos;enregistrer' onPress={() => register(pseudo, password)} />
            </View>

            <View style={styles.footer}>
                <SizedText label='Déjà inscrit ? ' size='17' />
                <Pressable onPress={() => changeView(0)}>
                    <SizedText style={commonStyles.link} size='17' label='Connectez-vous!' />
                </Pressable>
            </View>
        </View>
    );
}
