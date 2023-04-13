// Affichage récapitulatif de la session qui vient d'être créée avec le numéro de l'ID
import { View, StyleSheet } from 'react-native';
import { commonStyles } from '../constants/style';
import Title from '../components/Title';
import SizedText from '../components/SizedText';
import Field from '../components/Field';
import { BACKEND } from '../constants/backend';
import { useEffect, useState } from 'react';

export default function ShareSession({ idSession, token }) {
    const [donnees, setDonnees] = useState({});

    useEffect(() => {
        fetch(`${BACKEND}/joinSession/${idSession}`, {
            method: 'GET',
            headers: { 'x-access-token': token },
        })
            .then(response => response.json())
            .then(data => {
                setDonnees(data.session);
            })
            .catch(error => alert('Server error: ' + error));
    }, [token, idSession]);

    // TODO : remettre en forme le texte en bas
    return (
        <View style={[styles.container, commonStyles.container]}>
            <Title label='Récapitulatif de la session' />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                value={donnees.nbMinJoueurs}
                label={'Nombre minimal de joueurs'} />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                value={donnees.nbMaxJoueurs}
                label='Nombre maximal de joueurs' />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                value={donnees.dureeJour}
                label={'Durée d\'une journée en minutes'} />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                value={donnees.dureeNuit}
                label={'Durée d\'une nuit en minutes'} />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                value={donnees.probaC}
                label='Proba de contamination' />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                value={donnees.probaI}
                label={'Proba d\'insomnie'} />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                value={donnees.probaV}
                label={'Proba de voyance'} />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                value={donnees.probaS}
                label='Proba de spiritisme' />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                label={'Ratio de loups-garous'}
                value={donnees.probaLG} />
            <Field
                editable={false}
                inputStyle={styles.input}
                fieldStyle={styles.field}
                label={'Date de début'}
                value={donnees.debutPartie} />

            <SizedText size={20} label={'Voici l\'identifiant de la session à partager: #' + idSession} />
        </View>
    );
}

// ------------------------ Style --------------------------------------
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    input: {
        height: 35,
        width: 60,
    },
    field: {
        justifyContent: 'space-between',
        paddingHorizontal: '15%'
    },
    bouton: {
        marginTop: 10,
        height: 50
    },
});