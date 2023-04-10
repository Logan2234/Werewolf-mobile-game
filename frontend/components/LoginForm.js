import { StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import Bouton from './Bouton';
import SizedText from './SizedText';

export default function LoginForm({ onConnect, changeView }) {
    const [pseudo, setPseudo] = useState(null);
    const [password, setPassword] = useState(null);
    return (
        <View style={styles.form}>
            <View style={styles.header}>
                <Text style={styles.titleText}>Connexion</Text>
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
                    placeholder="Password" />
                <Bouton
                    nativeID='connect'
                    label='Se connecter'
                    onPress={() => onConnect(pseudo, password)} />
            </View>
            <View style={styles.footer}>
                <SizedText label='Pas encore inscrit ? ' size='17'/>
                <Pressable onPress={() => changeView(1)}>
                    <SizedText style={styles.link} size='17' label='Inscrivez-vous!'/>
                </Pressable>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    form: { display: 'flex', backgroundColor: '#313338', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' },
    
    titleText: { fontSize: 50, fontWeight: 'bold', marginTop: 100, color: 'white' },
    
    fields: { display: 'flex', gap: 25, alignItems: 'center' },
    input: { height: 40, borderWidth: 1, width: 200, paddingLeft: 5, borderRadius: 5, borderColor: '#B5BAC1', color: '#B5BAC1', fontSize: 15 },

    footer: { display: 'flex', flexDirection: 'row', marginBottom: 30 },
    link: { color: '#5865F2' },
});
