// Affichage récapitulatif de la session qui vient d'être créée avec le numéro de l'ID
import { View, StyleSheet } from 'react-native';
import { commonStyles } from '../constants/style';
import Title from '../components/Title';
import SizedText from '../components/SizedText';
import Field from '../components/Field';

export default function ShareSession(minPlayer, maxPlayer, lengthDay, lengthNight,
    startDate, contamination, insomnie, voyance, spiritisme, loupGarous, idSession) {

    return (
        <View style={[styles.container, commonStyles.container]}>
            <Title label='Récapitulatif de la session' />
            <Field
                editable={false}
                style={styles.input}
                value={minPlayer}
                label={'Nombre minimal de joueurs'} />
            <Field
                editable={false}
                style={styles.input}
                value={maxPlayer}
                label='Nombre maximal de joueurs' />
            <Field
                editable={false}
                style={styles.input}
                value={lengthDay}
                label={'Durée d\'une journée en minutes'} />
            <Field
                editable={false}
                style={styles.input}
                value={lengthNight}
                label={'Durée d\'une nuit en minutes'} />
            <Field
                editable={false}
                style={styles.input}
                value={contamination}
                label='Proba de contamination' />
            <Field
                editable={false}
                style={styles.input}
                value={insomnie}
                label={'Proba d\'insomnie'} />
            <Field
                editable={false}
                style={styles.input}
                value={voyance}
                label={'Proba de voyance'} />
            <Field
                editable={false}
                style={styles.input}
                value={spiritisme}
                label='Proba de spiritisme' />
            <Field
                editable={false}
                style={styles.input}
                label={'Ratio de loups-garous'}
                value={loupGarous} />
            <Field
                editable={false}
                style={styles.input}
                label={'Date de début'}
                value={startDate} />


            <SizedText label={'Voici l\'identifiant de la session à partager :'} />
            <SizedText label={idSession} size={30} />
        </View>
    );
}

// ------------------------ Style --------------------------------------
const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'space-between' }, // TODO alignItems fait de la merde
    input: { height: 35, width: 60 },
    bouton: { marginTop: 10, height: 50 },
});