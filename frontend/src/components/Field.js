//Field.js
import { StyleSheet, TextInput, View } from 'react-native';
import { placeholderColor, secondaryColor, textColor } from '../constants/colors';
import SizedText from './SizedText';

/**
 * Elément JSX renvoyant un champ de texte et un input correspondant.
 * 
 * @param {StyleSheet} inputStyle style à appliquer sur le champ 
 * @param {function} onSubmitEditing
 * @param {StyleSheet} fieldStyle style à appliquer sur l'ensemble texte + champ
 * @param {string} label texte à mettre à côté du champ
 * @param {function} onChangeText fonction appelée lorsque la valeur est changée
 * @param {*} value valeur par défaut
 * @param {*} placeholder
 * @param {boolean} secureTextEntry pour rentrer une valeur de manière sécurisée
 * @param {boolean} editable pour pouvoir modifier la valeur
 * @param {int} labelSize taille du texte à coté du champ
 *  
 * @returns Elément JSX
 */
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
