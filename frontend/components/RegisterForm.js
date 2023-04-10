import { StyleSheet, TextInput, Text, View } from 'react-native';
import { useState } from 'react';
import Bouton from './Bouton';

export default function RegisterForm({ onRegister }) {
    const [pseudo, setPseudo] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordConfirmation, setPasswordConfirmation] = useState(null);

    let afficheMotDePasseDiffere = false;

    function verify(passwordConfirmation) {
        setPasswordConfirmation(passwordConfirmation);
        if (passwordConfirmation !== password) {
            afficheMotDePasseDiffere = true;
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                nativeID='pseudoInput'
                style={styles.input}
                onChangeText={setPseudo}
                value={pseudo}
                placeholder="pseudo" />
            <TextInput
                nativeID='passwordInput'
                style={styles.input}
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                placeholder="Password" />
            <TextInput
                nativeID='passwordInputConfirmation'
                style={styles.input}
                secureTextEntry={true}
                onChangeText={verify}
                value={password}
                placeholder="Password" />
            <Text style={styles.baseText}>
                {
                    afficheMotDePasseDiffere &&
                    'Mot de passe invalide'
                }
            </Text>
            <Bouton
                nativeID='register'
                label='Enregistrer'
                onPress={() => onRegister(pseudo, password)}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    input: { height: 40, margin: 12, borderWidth: 1 },
    baseText: { color: 'red' }
});