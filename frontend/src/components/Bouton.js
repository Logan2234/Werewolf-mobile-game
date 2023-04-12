//Bouton.js
import { StyleSheet, Vibration } from 'react-native';
import { primaryColor, textColor } from '../constants/colors';
import { fontSize } from '../constants/style';
import { Button } from '@rneui/base';

export default function Bouton({ style, label, onPress, labelSize = fontSize }) {
    function onPressFunc() {
        Vibration.vibrate(20);
        onPress();
    }

    return (
        <Button onPress={onPressFunc} size='lg' buttonStyle={[styles.button, style]} title={label} titleStyle={[styles.label, { fontSize: parseFloat(labelSize) }]} />
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: primaryColor,
        borderRadius: 5,
        justifyContent: 'center',
    },
    label: {
        textAlign: 'center',
        color: textColor,
        fontSize: fontSize
    }
});
