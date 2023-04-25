import { backgroundColor, primaryColor } from './colors';
import { StyleSheet, Dimensions } from 'react-native';

export const commonStyles = StyleSheet.create({
    container: { backgroundColor: backgroundColor, width: '100%', height: '100%' },
    link: { color: primaryColor },
});

export const fontSize=Dimensions.get('window').width/27;
