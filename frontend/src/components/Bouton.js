//Bouton.js
import { StyleSheet, Pressable } from 'react-native';
import SizedText from './SizedText';
import { primaryColor, textColor } from '../constants/colors';
import { fontSize } from '../constants/style';

export default function Bouton({ style, label, onPress, labelSize }) {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress}>
            <SizedText style={styles.label} label={label} size={labelSize}/>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: primaryColor,
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
    },
    label: {
        textAlign: 'center',
        color: textColor,
        fontSize: fontSize
    }
});
