import { StyleSheet, TextInput, View, Text } from 'react-native';
import { useState } from 'react';
import { commonStyles } from '../constants';
import Bouton from './Bouton';
import Title from './Title';

export default function CreateSession({ onCreate }) {
    const [pseudo, setPseudo] = useState(''); // à récupérer

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

    return (
        <View style={[commonStyles.container, styles.container]}>
            <Title style={styles.title} label='Création d&apos;une session' />

            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Nombre minimal de joueurs: </Text>
                <TextInput
                    nativeID='minInput'
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={setMinPlayer}
                    value={minPlayer}
                />
            </View>

            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Nombre maximal de joueurs: </Text>
                <TextInput
                    nativeID='maxInput'
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={setMaxPlayer}
                    value={maxPlayer}
                />
            </View>

            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Durée d&apos;une journée en heures: </Text>
                <TextInput
                    nativeID='lengthDayHours'
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={setLengthDayHours}
                    value={lengthDayHours}
                />
            </View>
            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Durée d&apos;une journée en minutes: </Text>
                <TextInput
                    nativeID='lengthDayMin'
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={setLengthDayMin}
                    value={lengthDayMin}
                />
            </View>
            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Durée d&apos;une nuit en heure: </Text>
                <TextInput
                    nativeID='lengthNightHours'
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={setLengthNightHours}
                    value={lengthNightHours}
                />
            </View>
            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Durée d&apos;une nuit en minutes: </Text>
                <TextInput
                    nativeID='lengthNightMin'
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={setLengthNightMin}
                    value={lengthNightMin}
                />
            </View>

            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Probabilité de contamination: </Text>
                <TextInput
                    nativeID='contaminationProba'
                    style={styles.input}
                    keyboardType='decimal-pad'
                    onChangeText={setContamination}
                    value={contamination}
                />
            </View>

            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Probabilité d&apos;insomnie: </Text>
                <TextInput
                    nativeID='insomnieProba'
                    style={styles.input}
                    keyboardType='decimal-pad'
                    onChangeText={setInsomnie}
                    value={insomnie}
                />
            </View>
            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Probabilité de voyance: </Text>
                <TextInput
                    nativeID='voyanceProba'
                    style={styles.input}
                    keyboardType='decimal-pad'
                    onChangeText={setVoyance}
                    value={voyance}
                />
            </View>
            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Probabilité de spiritisme: </Text>
                <TextInput
                    nativeID='spiritismeProba'
                    style={styles.input}
                    keyboardType='decimal-pad'
                    onChangeText={setSpiritisme}
                    value={spiritisme}
                />
            </View>

            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Proportion de loups-garou: </Text>
                <TextInput
                    nativeID='loupGarouProportion'
                    style={styles.input}
                    keyboardType='decimal-pad'
                    onChangeText={setLoupGarous}
                    value={loupGarous}
                />
            </View>

            <View style={styles.textAndInput}>
                <Text style={styles.baseText}>Début de la partie: </Text>
                <TextInput
                    nativeID='startDate'
                    style={styles.input}
                    keyboardType='number-pad'
                    onChangeText={setStartDate}
                    value={startDate}
                />
            </View>

            <Bouton nativeID='createSession' style={styles.bouton} label='Créer la session'
                onPress={() => onCreate(pseudo, minPlayer, maxPlayer, lengthDayHours * 60 + lengthDayMin, lengthNightHours * 60 + lengthNightMin,
                    startDate, contamination, insomnie, voyance, spiritisme, loupGarous)} />
        </View >
    );
}
const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    textAndInput: { display: 'flex', alignItems: 'center', justifyContent:'space-between', flexDirection: 'row', width: '100%', paddingHorizontal: '15%'},
    input: { height: 35, borderWidth: 1, width: 60, paddingLeft: 5, borderRadius: 5, borderColor: '#B5BAC1', color: '#B5BAC1', fontSize: 15 },
    title: { marginTop: 50, marginBottom: 10 },
    bouton: { marginBottom: 30, marginTop: 10 },
    baseText: { color: 'white' }
});