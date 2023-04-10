import { StyleSheet, TextInput, View, Text } from 'react-native';
import { useState } from 'react';
import Bouton from './Bouton';

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
        <View style={styles.container}>
            <Text style={styles.titleText}>
                {'Création d\'une session'}
            </Text>
            <Text style={styles.baseText}>
                        {'Nombre minimal de joueurs'}
                    </Text>
            <TextInput
                nativeID='minInput'
                style={styles.input}
                onChangeText={setMinPlayer}
                value={minPlayer}
                placeholder="Nombre minimal de joueurs" />
            <Text style={styles.baseText}>
                        {'Nombre maximal de joueurs'}
                    </Text>
            <TextInput
                nativeID='maxInput'
                style={styles.input}
                onChangeText={setMaxPlayer}
                value={maxPlayer}
                placeholder="Nombre maximal de joueurs" />
                
            <Text style={styles.baseText}>
                        {"Durée d'une journée en heures"}
                    </Text>
            <TextInput
                nativeID='lengthDayHours'
                style={styles.input}
                onChangeText={setLengthDayHours}
                value={lengthDayHours}
                placeholder="Durée d'une journée en heures" />
            <Text style={styles.baseText}>
                        {"Durée d'une journée en minutes"}
                    </Text>
            <TextInput
                nativeID='lengthDayMin'
                style={styles.input}
                onChangeText={setLengthDayMin}
                value={lengthDayMin}
                placeholder="Durée d'une journée en minutes" />

            <Text style={styles.baseText}>
                        {"Durée d'une nuit en heure"}
                    </Text>
            <TextInput
                nativeID='lengthNightHours'
                style={styles.input}
                onChangeText={setLengthNightHours}
                value={lengthNightHours}
                placeholder="Durée d'une nuit en heures" />
            
            <Text style={styles.baseText}>
                        {"Durée d'une nuit en minutes"}
                    </Text>
            <TextInput
                nativeID='lengthNightMin'
                style={styles.input}
                onChangeText={setLengthNightMin}
                value={lengthNightMin}
                placeholder="Durée d'une nuit en minutes" />

            <Text style={styles.baseText}>
                        {'Début de la partie'}
                    </Text>
            <TextInput
                nativeID='startDate'
                style={styles.input}
                onChangeText={setStartDate}
                value={startDate}
                placeholder="Début de la partie" />

            <Text style={styles.baseText}>
                        {'Proba de contamination'}
                    </Text>
            <TextInput
                nativeID='contaminationProba'
                style={styles.input}
                onChangeText={setContamination}
                value={contamination}
                placeholder="Proba de contamination" />

            <Text style={styles.baseText}>
                        {"Proba d'insomnie"}
                    </Text>
            <TextInput
                nativeID='insomnieProba'
                style={styles.input}
                onChangeText={setInsomnie}
                value={insomnie}
                placeholder="Proba d'insomnie" />
            <Text style={styles.baseText}>
                        {"Proba de voyance" }
                    </Text>
            <TextInput
                nativeID='voyanceProba'
                style={styles.input}
                onChangeText={setVoyance}
                value={voyance}
                placeholder="Proba de voyance" />

            <Text style={styles.baseText}>
                        {"Proba de spiritisme"}
                    </Text>
            <TextInput
                nativeID='spiritismeProba'
                style={styles.input}
                onChangeText={setSpiritisme}
                value={spiritisme}
                placeholder="Proba de spiritisme" />

            <Text style={styles.baseText}>
                        {"Ratio de loups-garous"}
                    </Text>
            <TextInput
                nativeID='loupGarouRatio'
                style={styles.input}
                onChangeText={setLoupGarous}
                value={loupGarous}
                placeholder="Ratio de loups-garous" />
            <Bouton
                nativeID='createSession'
                label='Créer la session'
                onPress={() => onCreate(pseudo, minPlayer, maxPlayer, lengthDayHours*60 + lengthDayMin, lengthNightHours*60 + lengthNightMin,
                                startDate, contamination, insomnie, voyance, spiritisme, loupGarous)}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    input: { height: 40, margin: 12, borderWidth: 1 },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
      }
});