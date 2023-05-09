//Message.js
import { StyleSheet, View } from 'react-native';
import { fontSize } from '../constants/style';
import SizedText from './SizedText';

export default function Message({ pseudo, text }) {
    return (
        <View style={styles.res}>
            <SizedText style={styles.pseudo} label={pseudo + ': '} size={fontSize} />
            <SizedText style={styles.text} label={text} size={fontSize} />
        </View>
    );
}

const styles = StyleSheet.create({
    res: {
        marginHorizontal: 5,
        marginVertical: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    pseudo: {
        fontWeight: 'bold',
    }
});