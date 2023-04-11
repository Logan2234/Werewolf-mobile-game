import { StyleSheet, View } from 'react-native';
import { commonStyles } from '../constants/style';

export default function JoinSession() {
    return (
        <View style={[styles.container, commonStyles.container]}>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
});