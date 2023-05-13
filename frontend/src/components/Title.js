// Title.js
import { StyleSheet } from 'react-native';
import SizedText from './SizedText';

/**
 * Titre formaté
 * 
 * @param {StyleSheet} style style appliqué par-dessus le format initial
 * @param {string} label texte affiché
 * @returns Elément JSX
 */
export default function Title({ style, label }) {
    return (
        <SizedText style={[styles.titre, style]} size='40' label={label} />
    );
}

const styles = StyleSheet.create({
    titre: {
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
        textAlign: 'center'
    }
});
