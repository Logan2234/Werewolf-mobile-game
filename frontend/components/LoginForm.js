import { StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';
import Bouton from './Bouton';

export default function LoginForm({ onConnect }) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    return (
        <View style={styles.container}>
            <TextInput
                nativeID='emailInput'
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="email" />
            <TextInput
                nativeID='passwordInput'
                style={styles.input}
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                placeholder="Password" />
            <Bouton
                nativeID='connect'
                label='Se connecter'
                onPress={() => onConnect(email, password)}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    input: { height: 40, margin: 12, borderWidth: 1 }
});