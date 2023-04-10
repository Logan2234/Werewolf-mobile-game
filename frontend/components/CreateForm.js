import { StyleSheet, TextInput, View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import Bouton from './Bouton';
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
        <View style={styles.form}>
            <View style={styles.header}>
                <Text style={styles.titleText}>Création d'une partie</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <Field
                    nativeID='minInput'
                    setFunction={setMinPlayer}
                    value={minPlayer}
                    label='Nombre minimal de joueurs' />
                <Field
                    nativeID='maxInput'
                    setFunction={setMaxPlayer}
                    value={maxPlayer}
                    label='Nombre maximal de joueurs' />                    
                <Field
                    nativeID='lengthDayHours'
                    setFunction={setLengthDayHours}
                    value={lengthDayHours}
                    label={'Durée d\'une journée en heures'} />
                <Field
                    nativeID='lengthDayMin'
                    setFunction={setLengthDayMin}
                    value={lengthDayMin}
                    label={'Durée d\'une journée en minutes'} />
                <Field
                    nativeID='lengthNightHours'
                    setFunction={setLengthNightHours}
                    value={lengthNightHours}
                    label={'Durée d\'une nuit en heures'} />
                <Field
                    nativeID='lengthNightMin'
                    setFunction={setLengthNightMin}
                    value={lengthNightMin}
                    label={'Durée d\'une nuit en minutes'} />
                <Field
                    nativeID='startDate'
                    setFunction={setStartDate}
                    value={startDate}
                    label='Début de la partie' />
                <Field
                    nativeID='contaminationProba'
                    setFunction={setContamination}
                    value={contamination}
                    label='Proba de contamination' />
                <Field
                    nativeID='insomnieProba'
                    setFunction={setInsomnie}
                    value={insomnie}
                    label={'Proba d\'insomnie'} />
                <Field
                    nativeID='voyanceProba'
                    setFunction={setVoyance}
                    value={voyance}
                    label='Proba de voyance' />
                <Field
                    nativeID='spiritismeProba'
                    setFunction={setSpiritisme}
                    value={spiritisme}
                    label='Proba de spiritisme' />
                <Field
                    nativeID='loupGarouRatio'
                    label='Ratio de loups-garous'
                    setFunction={setLoupGarous}
                    value={loupGarous}/>
                <Bouton
                    nativeID='createSession'
                    label='Créer la session'
                    onPress={() => onCreate(pseudo, minPlayer, maxPlayer, lengthDayHours*60 + lengthDayMin, lengthNightHours*60 + lengthNightMin,
                                    startDate, contamination, insomnie, voyance, spiritisme, loupGarous)}
                />
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    form: { display: 'flex', backgroundColor: '#313338', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%'},

    titleText: { fontSize: 50, fontWeight: 'bold', marginTop: 50, color: 'white', padding: 10 },

    scrollView: { margin: 10 ,  marginBottom: 15, paddingLeft: 10, paddingRight:10 },
    error: { color: 'red', marginTop: -15 },

    footer: { display: 'flex', flexDirection: 'row', marginBottom: 30 },
    link: { color: '#5865F2' },
});