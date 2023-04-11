import { StyleSheet, View } from 'react-native';
import { commonStyles } from '../constants/style';
import Bouton from '../components/Bouton';
import Title from '../components/Title';
import SizedText from '../components/SizedText';
import Field from '../components/Field';
import { BACKEND } from '../constants/backend';
import { useState } from 'react';
// Pour les dates
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

// Pour l'envoi au backend
import checkProba from '../utils/Probability';
import subDates from '../utils/Dates';


export default function CreateSessionForm() {

    // ------------------------ Constantes --------------------------------------
    const [minPlayer, setMinPlayer] = useState('5');
    const [maxPlayer, setMaxPlayer] = useState('20');

    const [lengthDayHours, setLengthDayHours] = useState('14');
    const [lengthNightHours, setLengthNightHours] = useState('10');

    const [lengthDayMin, setLengthDayMin] = useState('0');
    const [lengthNightMin, setLengthNightMin] = useState('0');

    const [startDate, setStartDate] = useState(new Date()); //TODO : faire une fonction dans utils pour avoir le jour de demain 8h
    // () => {
    // const date = new Date();
    // return Date(moment(date).add(1,'day'));
    // }

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setStartDate(currentDate);
    };
    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(true);
        }
        setMode(currentMode);
    };
    const showDatepicker = () => { showMode('date'); };
    const showTimepicker = () => { showMode('time'); };

    const [contamination, setContamination] = useState('0');
    const [insomnie, setInsomnie] = useState('0');
    const [voyance, setVoyance] = useState('0');
    const [spiritisme, setSpiritisme] = useState('0');
    const [loupGarous, setLoupGarous] = useState('0.3');

    // ------------------------ Création de la session --------------------------------------
    function createSession() {
        const lengthDay = lengthDayHours * 60 + lengthDayMin;
        const lengthNight = lengthNightHours * 60 + lengthNightMin;
        
        // Vérification des probas
        const probaContamination = checkProba(contamination);
        if (probaContamination == null){return;}
        const probaInsomnie = checkProba(insomnie);
        if (probaInsomnie == null){return;}
        const probaVoyance = checkProba(voyance);
        if (probaVoyance == null){return;}
        const probaSpiritisme = checkProba(spiritisme);
        if (probaSpiritisme == null){return;}
        const probaLG = checkProba(loupGarous);
        if (probaLG == null){return;}

        timer = subDates(startDate, new Date());

        fetch(`${BACKEND}/createSession`, {
            method: 'POST',
            body: JSON.stringify({
                minPlayer, maxPlayer, lengthDay, lengthNight,
                timer, probaContamination, probaInsomnie, probaVoyance, probaSpiritisme, probaLG
            })
        })
            .then(response => response.json())
            .catch(error => alert('Server error: ' + error));
    }

    // ------------------------ Affichage --------------------------------------
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
            <SizedText label={'Début de la partie'} />
            <View style={styles.textAndInput}>
                <Bouton onPress={showDatepicker} label="Date de début" />
                <Bouton onPress={showTimepicker} label="Heure de début" />
                <SizedText label={'Début :' + startDate.toLocaleString()} />
                {show && (
                    <RNDateTimePicker
                        testID="dateTimePicker"
                        value={startDate}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                        minimumDate={new Date()}
                    />
                )}
            </View>
            <Bouton
                nativeID='createSession'
                label='Créer la session'
                style={styles.bouton}
                onPress={() => createSession()}
            />
        </View>
    );
}

// ------------------------ Style --------------------------------------
const styles = StyleSheet.create({
    container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    input: { height: 35, width: 60 },
    bouton: { marginBottom: 30, marginTop: 10 },
});