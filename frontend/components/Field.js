//Field.js
import { StyleSheet, TextInput, Text, View } from 'react-native';
import SizedText from './SizedText';

export default function Field({ label, setFunction, value, pad }) {
    return (
        <View style={styles.textAndInput}>
            <Text style={styles.baseText}>{label}</Text>
            <TextInput style={styles.input}
                onChangeText={setFunction}
                value={value}
                placeholder={label}
                keyboardType= {pad} />
        </View>
    );
}

const styles = StyleSheet.create({
    baseText: { paddingTop: 10, color: 'white' },
    input: { height: 35, borderWidth: 1, width: 60, paddingLeft: 5, borderRadius: 5, borderColor: '#B5BAC1', color: '#B5BAC1', fontSize: 15 },
    textAndInput: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', paddingHorizontal: '15%' },
});
