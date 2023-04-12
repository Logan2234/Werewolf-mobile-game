//Field.js
import { StyleSheet, TextInput, View } from 'react-native';
import SizedText from './SizedText';
import { placeholderColor, secondaryColor, textColor } from '../constants/colors';

export default function Field({ inputStyle, fieldStyle, label, setFunction, value, pad, placeholder, secureTextEntry, editable, labelSize }) {
    return (
        <View style={[styles.textAndInput, fieldStyle]}>
            <SizedText label={label} size={labelSize} />
            <TextInput
                style={[styles.input, inputStyle]}
                onChangeText={setFunction}
                value={value}
                secureTextEntry={secureTextEntry}
                keyboardType={pad}
                placeholderTextColor={placeholderColor}
                placeholder={placeholder}
                editable={editable}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        width: 200,
        paddingLeft: 5,
        borderRadius: 5,
        borderColor: secondaryColor,
        color: textColor,
        fontSize: 15
    },
    textAndInput: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
});
