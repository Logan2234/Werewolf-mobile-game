import { backgroundColor, primaryColor } from './colors';
import { StyleSheet, Dimensions } from 'react-native';

/**
 * Styles utilisés régulièrement dans l'application
 */
export const commonStyles = StyleSheet.create({
    container: { backgroundColor: backgroundColor, width: '100%', height: '100%' },
    link: { color: primaryColor },
    bottom: { position:'absolute', bottom:0, width: '95%', flex:1, marginBottom: 3, alignSelf: 'center', justifyContent: 'flex-end', }
});

export const fontSize=Dimensions.get('window').width/27;
