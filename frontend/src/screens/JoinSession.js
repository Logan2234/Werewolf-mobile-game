import { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Bouton from '../components/Bouton';
import Field from '../components/Field';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { errorColor, primaryColor, secondaryColor } from '../constants/colors';
import { errorCodes } from '../constants/errorCode';
import { ScreenContext, TokenContext } from '../constants/hooks';
import { views } from '../constants/screens';
import { commonStyles } from '../constants/style';
import { verifyNumber } from '../utils/verifyData';

export default function JoinSession({ setIdSession, idSession }) {
    const [borderColor, setBorderColor] = useState(secondaryColor);

    const changeView = useContext(ScreenContext);
    const token = useContext(TokenContext).token;

    function verifyData() {
        const idSessionVerification = verifyNumber(idSession, 0, 999999, 6);
        if (idSessionVerification == errorCodes.EMPTY)
            Alert.alert(errorCodes.EMPTY, 'Please enter a session ID.');
        else if (idSessionVerification == errorCodes.NOT_COMPLIANT)
            Alert.alert(errorCodes.NOT_COMPLIANT, 'The session ID must have 6 numbers.');
        else if (idSessionVerification == errorCodes.INVALID_FORMAT)
            Alert.alert(errorCodes.INVALID_FORMAT, 'The session ID must only contain numbers.');
        else {
            fetch(`${BACKEND}/joinSession/${idSession}`, {
                method: 'GET',
                headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.session){
                        setIdSession(idSession);
                        changeView(views.SHARE_SESSION);
                    } else {
                        Alert.alert(errorCodes.UNABLE_TO_CONNECT, 'This session does not exist.');
                    }
                })
                .catch(error => alert('Server error: ' + error));
        }
    }

    function formatInput(code) {
        if (idSession === '')
            setIdSession(code);
        else
            setIdSession(code.replaceAll(/[^0-9]/g, '').substring(0, 6));
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
            <Field label='ID de la session' value={value} placeholder='#XXXXXX' fieldStyle={styles.field} labelSize={30} onChangeText={formatInput} inputStyle={[styles.input, { borderColor: borderColor }]} pad='default' onSubmitEditing={verifyData} />
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