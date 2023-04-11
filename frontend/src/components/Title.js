// Title.js
import { StyleSheet } from 'react-native';
import SizedText from './SizedText';

export default function Title({ style, label }) {
    return (
        <SizedText style={[styles.titre, style]} size='40' label={label} />
    );
}

const styles = StyleSheet.create({
    titre: {
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 10
    }
});
