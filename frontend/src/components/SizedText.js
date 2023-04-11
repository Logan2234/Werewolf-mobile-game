//SizedText.js
import { StyleSheet, Text } from 'react-native';
import { textColor } from '../constants/colors';

export default function SizedText({ style, label, size }) {
    return (
        <Text style={[styles.text, style, {fontSize: parseFloat(size)}]}>{label}</Text>
    );
}

const styles = StyleSheet.create({
    text: {
        color: textColor,
    }
});
