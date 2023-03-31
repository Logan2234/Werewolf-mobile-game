//App.js
import { StyleSheet, Text, Pressable } from 'react-native';

export default function Bouton({ label, onPress }) {
    return (
        <Pressable onPress={onPress}>
            <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonLabel: {
        color: 'white',
        backgroundColor: 'blue',
        borderRadius: 5,
        margin: 5,
        padding: 5
    }
});
