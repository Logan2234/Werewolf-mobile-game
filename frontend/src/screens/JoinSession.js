import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Bouton from '../components/Bouton';
import Field from '../components/Field';
import Title from '../components/Title';
import { errorColor, primaryColor, secondaryColor } from '../constants/colors';
import { commonStyles } from '../constants/style';
import { verifyNumber } from '../utils/verifyData';
import { errorCodes } from '../constants/errorCode';
import { vues } from '../constants/screens';

export default function JoinSession({ changeView, setIdSession, idSession }) {
    const [borderColor, setBorderColor] = useState(secondaryColor);

    function verifyData() {
        const idSessionVerification = verifyNumber(idSession, 0, 999999);
        if (idSessionVerification == errorCodes.EMPTY)
            Alert.alert(errorCodes.EMPTY, 'Please enter a session ID.');
        else if (idSessionVerification == errorCodes.NOT_COMPLIANT)
            Alert.alert(errorCodes.NOT_COMPLIANT, 'The session ID must have 6 numbers.');
        else if (idSessionVerification == errorCodes.INVALID_FORMAT)
            Alert.alert(errorCodes.INVALID_FORMAT, 'The session ID must only contain numbers.');
        else {
            setIdSession(idSession);
            changeView(vues.SHARE_SESSION);
        }
    }

    function formatInput(code) {
        if (idSession === '')
            setIdSession(code);
        else
            setIdSession(code.replaceAll(/[#,.\- ]/g, '').substring(0, 6));
    }

    let value = (idSession === '') ? '' : '#' + idSession;

    useEffect(() => {
        if (idSession.length == 0)
            setBorderColor(secondaryColor);
        else if (idSession.length < 6)
            setBorderColor(errorColor);
        else
            setBorderColor(primaryColor);
    }, [idSession]);

    return (
        <View style={[commonStyles.container, styles.container]}>
            <Title label='Rejoindre une session' />
            <Field label='ID de la session' value={value} placeholder='#XXXXXX' fieldStyle={styles.field} labelSize={30} setFunction={formatInput} inputStyle={[styles.input, { borderColor: borderColor }]} pad='number-pad' onSubmitEditing={verifyData}/>
            <Bouton label='Rejoindre la session' labelSize={25} style={styles.bouton} onPress={verifyData} />
        </View>
    );
}

let styles = StyleSheet.create({
    container: { display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'column' },
    field: { flexDirection: 'column', gap: 20 },
    input: { width: 170, height: 75, fontSize: 40 },
    bouton: { borderRadius: 25, padding: 50, width: 300 },

});