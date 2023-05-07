//Message.js
import { StyleSheet, View } from 'react-native';
import SizedText from './SizedText';

export default function Message({ pseudo, text }) {
    return (
        <View style={styles.res}>
            <SizedText style={styles.pseudo} label={pseudo} size={12} />
            <SizedText style={styles.text} label={text} size={12} />
        </View>
    );
}

const styles = StyleSheet.create({
    res: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        margin: 10,
    },

    pseudo: {
        fontWeight: 'bold',
        paddingLeft: 0
    }
});