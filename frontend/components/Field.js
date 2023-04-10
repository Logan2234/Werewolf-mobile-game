//Bouton.js
import { StyleSheet, TextInput, Text} from 'react-native';
import SizedText from './SizedText';

export default function Field({ label, setFunction, value }) {
    return (
        <><Text style={styles.baseText}>{label}</Text><TextInput
            style={styles.input}
            onChangeText={setFunction}
            value={value}
            placeholder={label} /></>
    );
}

const styles = StyleSheet.create({
    baseText: { paddingTop: 10 },    
    fields: { display: 'flex', gap: 25, alignItems: 'center' },
    input: { height: 40, borderWidth: 1, width: 200, paddingLeft: 5, borderRadius: 5, borderColor: '#B5BAC1', color: '#B5BAC1', fontSize: 15, marginBottom: 5 },

    footer: { display: 'flex', flexDirection: 'row', marginBottom: 30 },
    link: { color: '#5865F2' },
});
