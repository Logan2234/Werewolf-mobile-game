import { StyleSheet, TextInput, View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { commonStyles } from '../constants';
import Bouton from './Bouton';
import Title from './Title';
import Field from './Field';

export default function CreateForm({ onCreate }) {
    const [pseudo, setPseudo] = useState(null); // à récupérer

    const [minPlayer, setMinPlayer] = useState('5');
    const [maxPlayer, setMaxPlayer] = useState('20');

    const [lengthDayHours, setLengthDayHours] = useState('14');
    const [lengthNightHours, setLengthNightHours] = useState('10');

    const [lengthDayMin, setLengthDayMin] = useState('0');
    const [lengthNightMin, setLengthNightMin] = useState('0');

    const [startDate, setStartDate] = useState(null) // choper demain 8h

    const [contamination, setContamination] = useState('0');
    const [insomnie, setInsomnie] = useState('0');
    const [voyance, setVoyance] = useState('0');
    const [spiritisme, setSpiritisme] = useState('0');
    const [loupGarous, setLoupGarous] = useState('0.3');

    return (
        <View style={[styles.container, commonStyles.container]}>
            <Title style={styles.title} label='Création d&apos;une partie' />
            <Field
                nativeID='minInput'
                setFunction={setMinPlayer}
                value={minPlayer}
                label='Nombre minimal de joueurs'
                pad='number-pad'
            />
            <Field
                nativeID='maxInput'
                setFunction={setMaxPlayer}
                value={maxPlayer}
                label='Nombre maximal de joueurs'
                pad='number-pad' />

            <Field
                nativeID='lengthDayHours'
                setFunction={setLengthDayHours}
                value={lengthDayHours}
                label={'Durée d\'une journée en heures'}
                pad='number-pad' />
            <Field
                nativeID='lengthDayMin'
                setFunction={setLengthDayMin}
                value={lengthDayMin}
                label={'Durée d\'une journée en minutes'}
                pad='number-pad' />
            <Field
                nativeID='lengthNightHours'
                setFunction={setLengthNightHours}
                value={lengthNightHours}
                label={'Durée d\'une nuit en heures'}
                pad='number-pad'
            />
            <Field
                nativeID='lengthNightMin'
                setFunction={setLengthNightMin}
                value={lengthNightMin}
                label={'Durée d\'une nuit en minutes'}
                pad='number-pad' />
            <Field
                nativeID='startDate'
                setFunction={setStartDate}
                value={startDate}
                label='Début de la partie'
                pad='number-pad' />
            <Field
                nativeID='contaminationProba'
                setFunction={setContamination}
                value={contamination}
                label='Proba de contamination'
                pad='number-pad' />
            <Field
                nativeID='insomnieProba'
                setFunction={setInsomnie}
                value={insomnie}
                label={'Proba d\'insomnie'}
                pad='number-pad' />
            <Field
                nativeID='voyanceProba'
                setFunction={setVoyance}
                value={voyance}
                label='Proba de voyance'
                pad='number-pad' />
            <Field
                nativeID='spiritismeProba'
                setFunction={setSpiritisme}
                value={spiritisme}
                label='Proba de spiritisme'
                pad='number-pad' />
            <Field
                nativeID='loupGarouRatio'
                label='Ratio de loups-garous'
                setFunction={setLoupGarous}
                value={loupGarous}
                pad='number-pad' />
            <Bouton
                nativeID='createSession'
                label='Créer la session'
                style={styles.bouton}
                onPress={() => onCreate(pseudo, minPlayer, maxPlayer, lengthDayHours * 60 + lengthDayMin, lengthNightHours * 60 + lengthNightMin,
                    startDate, contamination, insomnie, voyance, spiritisme, loupGarous)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { marginTop: 50, marginBottom: 10 },
    bouton: { marginBottom: 30, marginTop: 10 },
});