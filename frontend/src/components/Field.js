//Field.js
import { StyleSheet, TextInput, View } from 'react-native';
import SizedText from './SizedText';
import { secondaryColor } from '../constants/colors';

export default function Field({ style, label, setFunction, value, pad, placeholder, secureTextEntry, editable }) {
    return (
        <View style={styles.textAndInput}>
            <SizedText style={styles.text} label={label} />
            <TextInput 
                style={[styles.input, style]}
                onChangeText={setFunction}
                value={value}
                secureTextEntry={secureTextEntry}
                keyboardType={pad}
                placeholderTextColor={secondaryColor}
                placeholder={placeholder}
                editable={editable}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    text: { paddingTop: 10 },
    input: { height: 40, borderWidth: 1, width: 200, paddingLeft: 5, borderRadius: 5, borderColor: secondaryColor, color: secondaryColor, fontSize: 15 },
    textAndInput: { display: 'flex', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: '15%' },
});
