import { Alert, StyleSheet, View } from 'react-native';
import { commonStyles } from '../constants/style';
import { BACKEND } from '../constants/backend';
import { useState } from 'react';
import Bouton from '../components/Bouton';
import Title from '../components/Title';
import Field from '../components/Field';
import SelectDateHeure from '../components/SelectDateHeure';
// Pour les dates
import moment from 'moment';

// Pour l'envoi au backend
import checkProba from '../utils/Probability';
import subDates from '../utils/Dates';
import ShareSession from './ShareSession';


export default function CreateSessionForm({ token }) {

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

    const [contamination, setContamination] = useState('0');
    const [insomnie, setInsomnie] = useState('0');
    const [voyance, setVoyance] = useState('0');
    const [spiritisme, setSpiritisme] = useState('0');
    const [loupGarous, setLoupGarous] = useState('0.3');

    const [idGame, setIdGame] = useState(null);

    // ------------------------ Création de la session --------------------------------------
    function verifyData() {
        const lengthDay = lengthDayHours * 60 + lengthDayMin;
        const lengthNight = lengthNightHours * 60 + lengthNightMin;
        const probaC = checkProba(contamination);
        const probaIn = checkProba(insomnie);
        const probaVo = checkProba(voyance);
        const probaSp = checkProba(spiritisme);
        const probaLG = checkProba(loupGarous);
        const timer = subDates(startDate, new Date());

        if (probaC == null || probaIn == null || probaVo == null || probaSp == null || probaLG == null) {
            Alert.alert('Erreur des données rentrées', 'Les probabilités et proportions doivent être comprises entre 0 et 1.');
        } if (minPlayer < 5) {
            Alert.alert('Erreur des données rentrées', 'Le nombre minimal de joueurs doit être supérieur ou égal à 5.');
        } if (maxPlayer > 100) {
            Alert.alert('Erreur des données rentrées', 'Le nombre maximal de joueurs doit être inférieur ou égal à 100.');
        } if (lengthDayHours < 0 || lengthNightHours < 0 || lengthDayHours > 23 || lengthNightHours > 23) {
            Alert.alert('Erreur des données rentrées', 'Les durées demandées en heures doivent être comprises entre 0 et 23h.');
        } if (lengthDayMin < 0 || lengthNightMin < 0 || lengthDayMin > 59 || lengthNightMin > 59) {
            Alert.alert('Erreur des données rentrées', 'Les durées demandées en minutes doivent être comprises entre 0 et 59 minutes.');
            return;
        }

        sendData(lengthDay, lengthNight, timer, probaLG, probaVo, probaSp, probaIn, probaC);
    }

    function sendData(lengthDay, lengthNight, timer, probaLG, probaVo, probaSp, probaIn, probaC) {
        alert('{"nbMinJoueurs": ' + minPlayer + ', "nbMaxJoueurs": ' + maxPlayer + ', "dureeJour": ' + lengthDay + ', "dureeNuit": ' + lengthNight + ', "probaLG": ' + probaLG + ', "probaV": ' + probaVo + ', "probaS": ' + probaSp + ', "probaI": ' + probaIn + ', "probaC": ' + probaC + ', "debutPartie":  ' + timer + '}');
        fetch(`${BACKEND}/createSession`, {
            method: 'POST',
            headers: { 'x-access-token': token },
            body: new URLSearchParams({
                'data':
                    '{"nbMinJoueurs": ' + minPlayer + ', "nbMaxJoueurs": ' + maxPlayer + ', "dureeJour": ' + lengthDay + ', "dureeNuit": ' + lengthNight + ', "probaLG": ' + probaLG + ', "probaV": ' + probaVo + ', "probaS": ' + probaSp + ', "probaI": ' + probaIn + ', "probaC": ' + probaC + ', "debutPartie":  ' + timer + '}'
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.idGame) {
                    setIdGame(data.idGame);
                    ShareSession(minPlayer, maxPlayer, lengthDay, lengthNight,
                        startDate, contamination, insomnie, voyance, spiritisme, loupGarous, idGame);
                }
            })
            .catch(error => alert('Server error: ' + error));

        // TODO: Après l'envoi des données faut changer de vue
    }

    // ------------------------ Affichage --------------------------------------
    return (
        <View style={[styles.container, commonStyles.container]}>
            <Title label='Création d&apos;une partie' />
            <Field
                nativeID='minInput'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setMinPlayer}
                value={minPlayer}
                label='Nombre minimal de joueurs'
                pad='number-pad'
            />
            <Field
                nativeID='maxInput'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setMaxPlayer}
                value={maxPlayer}
                label='Nombre maximal de joueurs'
                pad='number-pad' />
            <Field
                nativeID='lengthDayHours'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setLengthDayHours}
                value={lengthDayHours}
                label={'Durée d\'une journée en heures'}
                pad='number-pad' />
            <Field
                nativeID='lengthDayMin'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setLengthDayMin}
                value={lengthDayMin}
                label={'Durée d\'une journée en minutes'}
                pad='number-pad' />
            <Field
                nativeID='lengthNightHours'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setLengthNightHours}
                value={lengthNightHours}
                label={'Durée d\'une nuit en heures'}
                pad='number-pad'
            />
            <Field
                nativeID='lengthNightMin'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setLengthNightMin}
                value={lengthNightMin}
                label={'Durée d\'une nuit en minutes'}
                pad='number-pad' />
            <Field
                nativeID='contaminationProba'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setContamination}
                value={contamination}
                label='Proba de contamination'
                pad='number-pad' />
            <Field
                nativeID='insomnieProba'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setInsomnie}
                value={insomnie}
                label={'Proba d\'insomnie'}
                pad='number-pad' />
            <Field
                nativeID='voyanceProba'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setVoyance}
                value={voyance}
                label='Proba de voyance'
                pad='number-pad' />
            <Field
                nativeID='spiritismeProba'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                setFunction={setSpiritisme}
                value={spiritisme}
                label='Proba de spiritisme'
                pad='number-pad' />
            <Field
                nativeID='loupGarouRatio'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                label='Ratio de loups-garous'
                setFunction={setLoupGarous}
                value={loupGarous}
                pad='number-pad' />
            <SelectDateHeure label='Début de la partie' startDate={startDate} setStartDate={setStartDate} />
            <Bouton
                nativeID='createSession'
                label='Créer la session'
                style={styles.bouton}
                labelSize={18}
                onPress={() => verifyData()}
            />
        </View>
    );
}

// ------------------------ Style --------------------------------------
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'space-between'
    }, // TODO alignItems fait de la merde
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