//Message.js
import { View, StyleSheet } from 'react-native';

export default function Message({pseudo, text}) {
    return (
        <View style={styles.res}>
            <SizedText style={pseudo} label={pseudo} />
            <SizedText label={text} />
        </View>
    )
}

const styles = StyleSheet.create({
    res: {
        display: 'flex',
        justifyContent:'space-between',
        paddingHorizontal: '25%',
        flexDirection: 'row'    
    },

    pseudo: {
        fontWeight: 'bold'
    }
})