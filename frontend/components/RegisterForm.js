import { StyleSheet, TextInput, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import Bouton from './Bouton';

export default function RegisterForm({ onRegister }) {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [afficheMotDePasseDiffere, setAfficheMotDePasseDiffere] = useState(false);

    useEffect(()=>{
        setAfficheMotDePasseDiffere(() => passwordConfirmation.length > 0 && password.length > 0 && passwordConfirmation !== password);
    },[passwordConfirmation, password]);
    
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>
                {'Inscription'}
            </Text>
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
                placeholder="Password" />
            <TextInput
                nativeID='passwordInputConfirmation'
                style={styles.input}
                secureTextEntry={true}
                onChangeText={setPasswordConfirmation}
                value={passwordConfirmation}
                placeholder="Password" />
            {
                (afficheMotDePasseDiffere == true) ?
                    <Text style={styles.baseText}>
                        {'Les mots de passe ne correspondent pas'}
                    </Text> : null
            }
            <Bouton
                nativeID='register'
                label='Enregistrer'
                onPress={() => onRegister(pseudo, password)}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'red', justifyContent: 'center' },
    input: { height: 40, margin: 12, borderWidth: 1 },
    baseText: { color: 'red' },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
      }
});