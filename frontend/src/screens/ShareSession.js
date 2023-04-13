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
            method: 'POST',
            headers: { 'x-access-token': token },
        })
            .then(response => response.json())
            .catch(error => alert('Server error: ' + error));
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
            <View style={styles.res}>
                <SizedText label={'Nombre minimal de joueurs:'} />
                <SizedText label={donnees.nbMinJoueurs} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Nombre maximal de joueurs:'} />
                <SizedText label={donnees.nbMaxJoueurs} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Durée d\'une journée en minutes:'} />
                <SizedText label={donnees.dureeJour} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Durée d\'une nuit en minutes:'} />
                <SizedText label={donnees.dureeNuit} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de contamination:'} />
                <SizedText label={donnees.probaC} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité d\'insomnie:'} />
                <SizedText label={donnees.probaI} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de voyance:'} />
                <SizedText label={donnees.probaV} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de spiritisme:'} />
                <SizedText label={donnees.probaS} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Ratio de loups-garou:'} />
                <SizedText label={donnees.probaLG} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Date de début:'} />
                <SizedText label={donnees.debutPartie} />
            </View>

            <View style={styles.idSection}>
                <SizedText size={20} label={'ID session: #'} />
                <SizedText style={styles.id} size={20} label={idSession} />
            </View>

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
    res: {
        display: 'flex',
        justifyContent:'space-between',
        paddingHorizontal: '25%',
        flexDirection: 'row'        
    },
    idSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20
    },
    id: {
        fontWeight: 'bold'
    }
});