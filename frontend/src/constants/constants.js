import { StyleSheet } from 'react-native';

/**
 * Constante de style pour s'enregistrer et ce connecter
 */
export const loginAndRegisterStyle = StyleSheet.create({
    form: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

    header: { marginTop: 120 },

    fields: { display: 'flex', gap: 25, alignItems: 'center' },
    error: { color: 'red', marginTop: -15 },

    footer: { display: 'flex', flexDirection: 'row', marginBottom: 30 },
});

