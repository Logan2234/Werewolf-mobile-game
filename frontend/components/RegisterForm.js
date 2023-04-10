import { TextInput, Pressable, View } from 'react-native';
import { useState, useEffect } from 'react';
import { BACKEND, loginAndRegisterStyle as styles, commonStyles } from '../constants';
import Bouton from './Bouton';
import Title from './Title';
import SizedText from './SizedText';

export default function RegisterForm({ setToken, changeView }) {
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
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
        setAfficheMotDePasseDiffere(() => passwordConfirmation.length > 0 && password.length > 0 && passwordConfirmation !== password);
    }, [passwordConfirmation, password]);

    return (
        <View style={[styles.form, commonStyles.container]}>
            <Title style={styles.header} label='Inscription' />
            <View style={styles.fields}>
                <TextInput
                    nativeID='pseudoInput'
                    style={styles.input}
                    onChangeText={setPseudo}
                    value={pseudo}
                    placeholderTextColor='#B5BAC1'
                    placeholder="Pseudo" />
                <TextInput
                    nativeID='passwordInput'
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                    placeholderTextColor='#B5BAC1'
                    placeholder="Mot de passe" />
                <TextInput
                    nativeID='passwordInputConfirmation'
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setPasswordConfirmation}
                    value={passwordConfirmation}
                    placeholderTextColor='#B5BAC1'
                    placeholder="Confirmation du mot de passe" />
                {
                    (afficheMotDePasseDiffere == true) ?
                        <SizedText style={styles.error} label='Les mots de passe ne correspondent pas' size='15' />
                        : null
                }
                <Bouton
                    nativeID='register'
                    label='S&apos;enregistrer'
                    onPress={() => register(pseudo, password)} />
            </View>
            <View style={styles.footer}>
                <SizedText label='Déjà inscrit ? ' size='17' />
                <Pressable onPress={() => changeView(0)}>
                    <SizedText style={styles.link} size='17' label='Connectez-vous!' />
                </Pressable>
            </View>
        </View>
    );
}
