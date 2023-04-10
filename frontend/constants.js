import { StyleSheet } from 'react-native';

export const BACKEND = 'https://localhost:3000';

export const loginAndRegisterStyle = StyleSheet.create({
    form: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

    fields: { display: 'flex', gap: 25, alignItems: 'center' },
    input: { height: 40, borderWidth: 1, width: 200, paddingLeft: 5, borderRadius: 5, borderColor: '#B5BAC1', color: '#B5BAC1', fontSize: 15 },

    error: { color: 'red', marginTop: -15 },

    footer: { display: 'flex', flexDirection: 'row', marginBottom: 30 },
    link: { color: '#3AC670' },
});

export const commonStyles = StyleSheet.create({
    container: { backgroundColor: '#313338', width: '100%', height: '100%' },
});