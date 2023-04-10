import { StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import Bouton from './Bouton';
import SizedText from './SizedText';

export default function RegisterForm({ onRegister, changeView }) {
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [afficheMotDePasseDiffere, setAfficheMotDePasseDiffere] = useState(false);

    useEffect(() => {
        setAfficheMotDePasseDiffere(() => passwordConfirmation.length > 0 && password.length > 0 && passwordConfirmation !== password);
    }, [passwordConfirmation, password]);

    return (
        <View style={styles.form}>
            <View style={styles.header}>
                <Text style={styles.titleText}>Inscription</Text>
            </View>
            <View style={styles.fields}>
                <TextInput
                    nativeID='pseudoInput'
                    style={styles.input}
                    onChangeText={setPseudo}
                    value={pseudo}
                    placeholder="Pseudo" />
                <TextInput
                    nativeID='passwordInput'
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Mot de passe" />
                <TextInput
                    nativeID='passwordInputConfirmation'
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setPasswordConfirmation}
                    value={passwordConfirmation}
                    placeholder="Confirmation du mot de passe" />
                {
                    (afficheMotDePasseDiffere == true) ?
                        <Text style={styles.error}>
                            {'Les mots de passe ne correspondent pas'}
                        </Text> : null
                }
                <Bouton
                    nativeID='register'
                    label='S&apos;enregistrer'
                    onPress={() => onRegister(pseudo, password)} />
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

const styles = StyleSheet.create({
    form: { display: 'flex', backgroundColor: '#313338', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' },

    titleText: { fontSize: 50, fontWeight: 'bold', marginTop: 100, color: 'white' },

    fields: { display: 'flex', gap: 25, alignItems: 'center' },
    input: { height: 40, borderWidth: 1, width: 200, paddingLeft: 5, borderRadius: 5, borderColor: '#B5BAC1', color: '#B5BAC1', fontSize: 15 },
    error: { color: 'red', marginTop: -15 },

    footer: { display: 'flex', flexDirection: 'row', marginBottom: 30 },
    link: { color: '#5865F2' },
});