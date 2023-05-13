//Bouton.js
import { Button } from '@rneui/base';
import { StyleSheet, Vibration } from 'react-native';
import { primaryColor, textColor } from '../constants/colors';
import { fontSize } from '../constants/style';

/**
 * Bouton en format JSX paramétrable
 * 
 * @param {StyleSheet} style style à appliquer par-dessus celui de base
 * @param {string} label texte à afficher sur le bouton
 * @param {function} onPress fonction à exécuter lors de l'appui sur le bouton
 * @param {int} labelSize taille de l'écriture du bouton
 * @returns Un bouton format JSX formatté avec une titre et une fonction définis
 */
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
