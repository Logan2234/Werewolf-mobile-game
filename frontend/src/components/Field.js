//Field.js
import { StyleSheet, TextInput, View } from 'react-native';
import SizedText from './SizedText';
import { placeholderColor, secondaryColor, textColor } from '../constants/colors';

export default function Field({ inputStyle, onSubmitEditing, fieldStyle, label, onChangeText, value, pad, placeholder, secureTextEntry, editable, labelSize }) {
    return (
        <View style={[styles.textAndInput, fieldStyle]}>
            <SizedText label={label} size={labelSize} />
            <TextInput
                style={[styles.input, inputStyle]}
                onSubmitEditing={onSubmitEditing}
                onChangeText={onChangeText}
                value={value}
                secureTextEntry={secureTextEntry}
                keyboardType={pad}
                placeholderTextColor={placeholderColor}
                placeholder={placeholder}
                
                editable={editable} />
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
