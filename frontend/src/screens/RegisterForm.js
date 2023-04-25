import { useContext, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import Bouton from '../components/Bouton';
import Field from '../components/Field';
import SizedText from '../components/SizedText';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { loginAndRegisterStyle as styles } from '../constants/constants';
import { errorCodes } from '../constants/errorCode';
import { ScreenContext, TokenContext } from '../constants/hooks';
import { views } from '../constants/screens';
import { commonStyles } from '../constants/style';
import { verifyString } from '../utils/verifyData';

export default function RegisterForm() {
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const changeView = useContext(ScreenContext);
    const setToken = useContext(TokenContext).setToken;

    function verifyData() {
        const pseudoVerification = verifyString(pseudo, 5, 16, /[^0-9a-zA-Z]/g);
        const passwordVerification = verifyString(password, 8, 32);
        const passwordCVerification = verifyString(passwordConfirmation, 8, 32);

        if (pseudoVerification == errorCodes.EMPTY)
            Alert.alert(errorCodes.EMPTY, 'Please enter a username.');
        else if (pseudoVerification == errorCodes.NOT_COMPLIANT)
            Alert.alert(errorCodes.NOT_COMPLIANT, 'Please enter a 5 to 16 characters username.');
        else if (pseudoVerification == errorCodes.INVALID_FORMAT)
            Alert.alert(errorCodes.INVALID_FORMAT, 'The username must contain only letters and numbers.');
        else if (passwordVerification == errorCodes.EMPTY)
            Alert.alert(errorCodes.EMPTY, 'Please enter a password.');
        else if (passwordVerification == errorCodes.NOT_COMPLIANT)
            Alert.alert(errorCodes.NOT_COMPLIANT, 'Please enter a 8 to 32 characters password.');
        else if (passwordCVerification == errorCodes.EMPTY)
            Alert.alert(errorCodes.EMPTY, 'Please confirm your password.');
        else if (password !== passwordConfirmation)
            Alert.alert(errorCodes.NOT_EQUAL, 'Your password is not equal to your confirmation password.');
        else
            register();
    }

    function register() {
        fetch(`${BACKEND}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: '{"username": "' + pseudo + '","password": "' + password + '"}' })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    setToken(data.token);
                    changeView(views.CREATE_OR_JOIN);
                } else
                    Alert.alert('Enregistrement impossible', data.message);
            })
            .catch(error => alert('Server error: ' + error));
    }

    // TODO: Enter on first and second field goes to the second one
    return (
        <View style={[styles.form, commonStyles.container]}>
            <Title style={styles.header} label='Inscription' />

            <View style={styles.fields}>
                <Field nativeID='pseudoInput' value={pseudo} onChangeText={setPseudo} placeholder='Pseudo' />
                <Field nativeID='passwordInput' value={password} onChangeText={setPassword} placeholder='Mot de passe' secureTextEntry={true} />
                <Field nativeID='passwordInputConfirmation' value={passwordConfirmation} onChangeText={setPasswordConfirmation} placeholder='Confirmation du mot de passe' secureTextEntry={true} onSubmitEditing={() => register()} />
                <Bouton nativeID='register' label='S&apos;enregistrer' onPress={verifyData} />
            </View>

            <View style={styles.footer}>
                <SizedText label='Déjà inscrit ? ' size='17' />
                <Pressable onPress={() => changeView(views.LOGIN)}>
                    <SizedText style={commonStyles.link} size='17' label='Connectez-vous!' />
                </Pressable>
            </View>
        </View>
    );
}
