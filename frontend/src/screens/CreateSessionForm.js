import { useContext, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Bouton from '../components/Bouton';
import Field from '../components/Field';
import SelectDateHeure from '../components/SelectDateHeure';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { ScreenContext, TokenContext } from '../constants/hooks';
import { views } from '../constants/screens';
import { commonStyles } from '../constants/style';
import subDates, { tomorrowDate } from '../utils/dates';
import { verifyProba } from '../utils/verifyData';

export default function CreateSessionForm({ setIdSession }) {
    // ------------------------ Constantes --------------------------------------
    const [minPlayer, setMinPlayer] = useState('5');
    const [maxPlayer, setMaxPlayer] = useState('20');

    const [lengthDayHours, setLengthDayHours] = useState('14');
    const [lengthNightHours, setLengthNightHours] = useState('10');

    const [lengthDayMin, setLengthDayMin] = useState('0');
    const [lengthNightMin, setLengthNightMin] = useState('0');

    const [startDate, setStartDate] = useState(tomorrowDate);
    const [contamination, setContamination] = useState('0');
    const [insomnie, setInsomnie] = useState('0');
    const [voyance, setVoyance] = useState('0');
    const [spiritisme, setSpiritisme] = useState('0');
    const [loupGarous, setLoupGarous] = useState('0.3');

    const changeView = useContext(ScreenContext);
    const token = useContext(TokenContext).token;

    // ------------------------ Création de la session --------------------------------------
    function verifyData() {
        const lengthDay = lengthDayHours * 60 + parseInt(lengthDayMin);
        const lengthNight = lengthNightHours * 60 + parseInt(lengthNightMin);
        const probaC = verifyProba(contamination);
        const probaIn = verifyProba(insomnie);
        const probaVo = verifyProba(voyance);
        const probaSp = verifyProba(spiritisme);
        const probaLG = verifyProba(loupGarous);
        const timer = subDates(startDate, new Date());

        if (startDate.getTime() <= new Date().getTime()){
            Alert.alert('Erreur de données rentrées', 'La date ne peut pas être déjà passée')
            return;
        }

        if (probaC == null || probaIn == null || probaVo == null || probaSp == null || probaLG == null) {
            Alert.alert('Erreur des données rentrées', 'Les probabilités et proportions doivent être comprises entre 0 et 1.');
            return;
        // TODO : décommenter au merge
        // } if (minPlayer < 5) {
        //     Alert.alert('Erreur des données rentrées', 'Le nombre minimal de joueurs doit être supérieur ou égal à 5.');
        } if (maxPlayer > 100) {
            Alert.alert('Erreur des données rentrées', 'Le nombre maximal de joueurs doit être inférieur ou égal à 100.');
            return;
        } if (lengthDayHours < 0 || lengthNightHours < 0 || lengthDayHours > 23 || lengthNightHours > 23) {
            Alert.alert('Erreur des données rentrées', 'Les durées demandées en heures doivent être comprises entre 0 et 23h.');
            return;
        } if (lengthDayMin < 0 || lengthNightMin < 0 || lengthDayMin > 59 || lengthNightMin > 59) {
            Alert.alert('Erreur des données rentrées', 'Les durées demandées en minutes doivent être comprises entre 0 et 59 minutes.');
            return;
        } if (parseInt(minPlayer) > maxPlayer) {
            Alert.alert('Erreur des données rentrées', 'Le nombre minimum de joueurs ne peut être supérieur au nombre maximal.');
            return;
        }
        sendData(lengthDay, lengthNight, timer, probaLG, probaVo, probaSp, probaIn, probaC);
    }

    async function sendData(lengthDay, lengthNight, timer, probaLG, probaVo, probaSp, probaIn, probaC) {
        await fetch(`${BACKEND}/createSession`, {
            method: 'POST',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                data: '{"nbMinJoueurs": ' + minPlayer + ', "nbMaxJoueurs": ' + maxPlayer + ', "dureeJour": ' + lengthDay + ', "dureeNuit": ' + lengthNight + ', "probaLG": ' + probaLG + ', "probaV": ' + probaVo + ', "probaS": ' + probaSp + ', "probaI": ' + probaIn + ', "probaC": ' + probaC + ', "debutPartie":  ' + timer + '}'
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.idGame) {
                    setIdSession(data.idGame);
                    changeView(views.SHARE_SESSION);
                }
            })
            .catch(error => alert('Server error: ' + error));
    }

    // ------------------------ Affichage --------------------------------------
    return (
        <View style={[styles.container, commonStyles.container]}>
            <Title label='Création d&apos;une partie' />
            <Field
                nativeID='minInput'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setMinPlayer}
                value={minPlayer}
                label='Nombre minimal de joueurs'
                pad='number-pad'
            />
            <Field
                nativeID='maxInput'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setMaxPlayer}
                value={maxPlayer}
                label='Nombre maximal de joueurs'
                pad='number-pad' />
            <Field
                nativeID='lengthDayHours'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setLengthDayHours}
                value={lengthDayHours}
                label={'Durée d\'une journée en heures'}
                pad='number-pad' />
            <Field
                nativeID='lengthDayMin'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setLengthDayMin}
                value={lengthDayMin}
                label={'Durée d\'une journée en minutes'}
                pad='number-pad' />
            <Field
                nativeID='lengthNightHours'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setLengthNightHours}
                value={lengthNightHours}
                label={'Durée d\'une nuit en heures'}
                pad='number-pad'
            />
            <Field
                nativeID='lengthNightMin'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setLengthNightMin}
                value={lengthNightMin}
                label={'Durée d\'une nuit en minutes'}
                pad='number-pad' />
            <Field
                nativeID='contaminationProba'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setContamination}
                value={contamination}
                label='Proba de contamination'
                pad='number-pad' />
            <Field
                nativeID='insomnieProba'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setInsomnie}
                value={insomnie}
                label={'Proba d\'insomnie'}
                pad='number-pad' />
            <Field
                nativeID='voyanceProba'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setVoyance}
                value={voyance}
                label='Proba de voyance'
                pad='number-pad' />
            <Field
                nativeID='spiritismeProba'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                onChangeText={setSpiritisme}
                value={spiritisme}
                label='Proba de spiritisme'
                pad='number-pad' />
            <Field
                nativeID='loupGarouRatio'
                inputStyle={styles.input}
                fieldStyle={styles.field}
                label='Ratio de loups-garous'
                onChangeText={setLoupGarous}
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