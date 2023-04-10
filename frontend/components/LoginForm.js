import { TextInput, View, Pressable } from 'react-native';
import { useState } from 'react';
import { BACKEND, loginAndRegisterStyle as styles, commonStyles } from '../constants';
import Bouton from './Bouton';
import Title from './Title';
import SizedText from './SizedText';

export default function LoginForm({ setToken, changeView }) {
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');

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
                <TextInput
                    nativeID='pseudoInput'
                    style={styles.input}
                    onChangeText={setPseudo}
                    value={pseudo}
                    placeholder="Pseudo"
                    placeholderTextColor='#B5BAC1'
                />
                <TextInput
                    nativeID='passwordInput'
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                    placeholderTextColor='#B5BAC1'
                    placeholder="Password" />
                <Bouton
                    nativeID='connect'
                    label='Se connecter'
                    onPress={() => connect(pseudo, password)} />
            </View>
            <View style={styles.footer}>
                <SizedText label='Pas encore inscrit ? ' size='17' />
                <Pressable onPress={() => changeView(1)}>
                    <SizedText style={styles.link} size='17' label='Inscrivez-vous!' />
                </Pressable>
            </View>
        </View >
    );
}
