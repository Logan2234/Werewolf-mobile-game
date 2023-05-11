//Bouton.js
import { Button } from '@rneui/base';
import { StyleSheet, Vibration } from 'react-native';
import { primaryColor, textColor } from '../constants/colors';
import { fontSize } from '../constants/style';

export default function Bouton({ style, label, onPress, labelSize = fontSize }) {
    function onPressFunc() {
        Vibration.vibrate(20);
        onPress();
    }

    return (
        <Button onPress={onPressFunc}
            buttonStyle={[styles.button, style]}
            titleStyle={[styles.label, { fontSize: parseFloat(labelSize) }]}
            size='lg'
            title={label}
        />
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
