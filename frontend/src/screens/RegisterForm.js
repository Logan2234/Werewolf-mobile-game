import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import Bouton from '../components/Bouton';
import Field from '../components/Field';
import SizedText from '../components/SizedText';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { loginAndRegisterStyle as styles } from '../constants/constants';
import { vues } from '../constants/screens';
import { commonStyles } from '../constants/style';
import { verifyString } from '../utils/verifyData';
import { errorCodes } from '../constants/errorCode';

export default function RegisterForm({ changeView, setToken, pseudo, setPseudo, password, setPassword }) {
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [afficheMotDePasseDiffere, setAfficheMotDePasseDiffere] = useState(false);

    function verifyData() {
        const pseudoVerification = verifyString(pseudo, 5, 32, /[^0-9a-zA-Z]/g);
        const passwordVerification = verifyString(password, 8, 32);
        const passwordCVerification = verifyString(passwordConfirmation, 8, 32);

        if (pseudoVerification == errorCodes.EMPTY)
            Alert.alert(errorCodes.EMPTY, 'Please enter a username.');
        else if (pseudoVerification == errorCodes.NOT_COMPLIANT)
            Alert.alert(errorCodes.NOT_COMPLIANT, 'Please enter a 5 to 32 characters username.');
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
            body: new URLSearchParams({ 'data': '{"username": "' + pseudo + '","password": "' + password + '"}' })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    setToken(data.token);
                    changeView(vues.CREATE_OR_JOIN);
                } else
                    Alert.alert('Enregistrement impossible', data.message);
            })
            .catch(error => alert('Server error: ' + error));
    }

    useEffect(() => {
        setAfficheMotDePasseDiffere(() => password.length > 0 && password.length == passwordConfirmation.length && passwordConfirmation !== password);
    }, [passwordConfirmation, password]);

    // TODO: Enter on first and second field goes to the second one
    return (
        <View style={[styles.form, commonStyles.container]}>
            <Title style={styles.header} label='Inscription' />

            <View style={styles.fields}>
                <Field nativeID='pseudoInput' value={pseudo} setFunction={setPseudo} placeholder='Pseudo' />
                <Field nativeID='passwordInput' value={password} setFunction={setPassword} placeholder='Mot de passe' secureTextEntry={true} />
                <Field nativeID='passwordInputConfirmation' value={passwordConfirmation} setFunction={setPasswordConfirmation} placeholder='Confirmation du mot de passe' secureTextEntry={true} onSubmitEditing={() => register()} />
                {
                    (afficheMotDePasseDiffere == true) ?
                        <SizedText style={styles.error} label='Les mots de passe ne correspondent pas' />
                        : null
                }
                <Bouton nativeID='register' label='S&apos;enregistrer' onPress={verifyData} />
            </View>

            <View style={styles.footer}>
                <SizedText label='Déjà inscrit ? ' size='17' />
                <Pressable onPress={() => changeView(vues.LOGIN)}>
                    <SizedText style={commonStyles.link} size='17' label='Connectez-vous!' />
                </Pressable>
            </View>
        </View>
    );
}
