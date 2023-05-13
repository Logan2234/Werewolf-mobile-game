//Eligible.js

import { StyleSheet, View } from 'react-native';
import SizedText from './SizedText';
import { commonStyles } from '../constants/style';
import { primaryColor } from '../constants/colors';

/**
 * Elément JSX qui affiche une personne proposée au vote et éventuellement le nombre de voies contre elle s'il y en a plus que 0.
 * 
 * @param {string} name nom de la personne proposée
 * @param {int} votes nombre de votes contre la personne
 * @param {boolean} selected indique si la personne a été sélectionnée
 * @returns Personne (objet JSX) qui a été proposée au vote avec son nombre de vote associé
 * et de style différent si sélectionnée
 */
export default function Propose({ name, votes = '0', selected }) {
    if (selected && votes !== '0') {
        return (
            <View style={styles.container}>
                <SizedText style={styles.pseudoSel} label={name} />
                <SizedText label={votes} />
            </View>
        );
    } else if (selected && votes === '0') {
        return (
            <View style={styles.container}>
                <SizedText style={styles.pseudoSel} label={name} />
            </View>
        );
    } else if (!selected && votes !== '0') {
        return (
            <View style={styles.container}>
                <SizedText style={styles.pseudo} label={name} />
                <SizedText label={votes} />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <SizedText style={styles.pseudo} label={name} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        height: 40,
        color: primaryColor
    },

    pseudoSel: {
        fontWeight: 'bold'
    },
});