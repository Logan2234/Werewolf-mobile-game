import { backgroundColor, primaryColor } from './colors';
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    container: { backgroundColor: backgroundColor, width: '100%', height: '100%' },
    link: { color: primaryColor },
});

export const fontSize=15;