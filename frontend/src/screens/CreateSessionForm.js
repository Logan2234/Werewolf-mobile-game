import { StyleSheet, View } from 'react-native';
import { commonStyles } from '../constants/style';
import Bouton from '../components/Bouton';
import Title from '../components/Title';
import Field from '../components/Field';
import { BACKEND } from '../constants/backend';
import { useState } from 'react';

export default function CreateSessionForm() {
    const [minPlayer, setMinPlayer] = useState('5');
    const [maxPlayer, setMaxPlayer] = useState('20');

    const [lengthDayHours, setLengthDayHours] = useState('14');
    const [lengthNightHours, setLengthNightHours] = useState('10');

    const [lengthDayMin, setLengthDayMin] = useState('0');
    const [lengthNightMin, setLengthNightMin] = useState('0');

    const [startDate, setStartDate] = useState(null); // choper demain 8h

    const [contamination, setContamination] = useState('0');
    const [insomnie, setInsomnie] = useState('0');
    const [voyance, setVoyance] = useState('0');
    const [spiritisme, setSpiritisme] = useState('0');
    const [loupGarous, setLoupGarous] = useState('0.3');
    
    function createSession() {
        const lengthDay = lengthDayHours * 60 + lengthDayMin;
        const lengthNight = lengthNightHours * 60 + lengthNightMin;
        
        fetch(`${BACKEND}/createSession`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                minPlayer, maxPlayer, lengthDay, lengthNight,
                startDate, contamination, insomnie, voyance, spiritisme, loupGarous
            })
        })
            .then(response => response.json())
            .catch(error => alert('Server error: ' + error));
    }

    return (
        <View style={[styles.container, commonStyles.container]}>
            <Title label='Création d&apos;une partie' />
            <Field
                nativeID='minInput'
                style={styles.input}
                setFunction={setMinPlayer}
                value={minPlayer}
                label='Nombre minimal de joueurs'
                pad='number-pad'
            />
            <Field
                nativeID='maxInput'
                style={styles.input}
                setFunction={setMaxPlayer}
                value={maxPlayer}
                label='Nombre maximal de joueurs'
                pad='number-pad' />

            <Field
                nativeID='lengthDayHours'
                style={styles.input}
                setFunction={setLengthDayHours}
                value={lengthDayHours}
                label={'Durée d\'une journée en heures'}
                pad='number-pad' />
            <Field
                nativeID='lengthDayMin'
                style={styles.input}
                setFunction={setLengthDayMin}
                value={lengthDayMin}
                label={'Durée d\'une journée en minutes'}
                pad='number-pad' />
            <Field
                nativeID='lengthNightHours'
                style={styles.input}
                setFunction={setLengthNightHours}
                value={lengthNightHours}
                label={'Durée d\'une nuit en heures'}
                pad='number-pad'
            />
            <Field
                nativeID='lengthNightMin'
                style={styles.input}
                setFunction={setLengthNightMin}
                value={lengthNightMin}
                label={'Durée d\'une nuit en minutes'}
                pad='number-pad' />
            <Field
                nativeID='contaminationProba'
                style={styles.input}
                setFunction={setContamination}
                value={contamination}
                label='Proba de contamination'
                pad='number-pad' />
            <Field
                nativeID='insomnieProba'
                style={styles.input}
                setFunction={setInsomnie}
                value={insomnie}
                label={'Proba d\'insomnie'}
                pad='number-pad' />
            <Field
                nativeID='voyanceProba'
                style={styles.input}
                setFunction={setVoyance}
                value={voyance}
                label='Proba de voyance'
                pad='number-pad' />
            <Field
                nativeID='spiritismeProba'
                style={styles.input}
                setFunction={setSpiritisme}
                value={spiritisme}
                label='Proba de spiritisme'
                pad='number-pad' />
            <Field
                nativeID='loupGarouRatio'
                style={styles.input}
                label='Ratio de loups-garous'
                setFunction={setLoupGarous}
                value={loupGarous}
                pad='number-pad' />
            <Field
                nativeID='startDate'
                style={styles.input}
                setFunction={setStartDate}
                value={startDate}
                label='Début de la partie'
                pad='number-pad' />
            <Bouton
                nativeID='createSession'
                label='Créer la session'
                style={styles.bouton}
                onPress={() => createSession()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    input: { height: 35, width: 60 },
    bouton: { marginBottom: 30, marginTop: 10 },
});