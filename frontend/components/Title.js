// Title.js
import { StyleSheet, Text } from 'react-native';

export default function Title({ style, label }) {
    return (
        <Text style={[styles.titre, style]}>{label}</Text>
    );
}

const styles = StyleSheet.create({
    titre: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    }
});
