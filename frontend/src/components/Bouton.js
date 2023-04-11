//Bouton.js
import { StyleSheet, Pressable } from 'react-native';
import SizedText from './SizedText';
import { primaryColor } from '../constants/colors';

export default function Bouton({ style, label, onPress }) {
    return (
        <Pressable style={[style, styles.buttonLabel]} onPress={onPress}>
            <SizedText style={styles.label} size='15' label={label}/>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonLabel: {
        backgroundColor: primaryColor,
        borderRadius: 5,
        padding: 10,
        fontSize: 15
    },
    label: {
        textAlign: 'center',
        color: 'white',
    }
});
