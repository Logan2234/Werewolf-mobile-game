// Affichage récapitulatif de la session qui vient d'être créée avec le numéro de l'ID
import { View, StyleSheet, Text } from 'react-native';
import { commonStyles } from '../constants/style';
import Title from '../components/Title';
import SizedText from '../components/SizedText';
import { BACKEND } from '../constants/backend';
import { useEffect, useState } from 'react';
import { backgroundColor, primaryColor } from '../constants/colors';
import { Button } from '@rneui/base';

export default function ShareSession({ idSession, token }) {
    const [donnees, setDonnees] = useState({});
    const [showUsers, setShowUsers] = useState(0);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND}/joinSession/${idSession}`, {
            method: 'GET',
            headers: { 'x-access-token': token },
        })
            .then(response => response.json())
            .then(data => {
                setDonnees(data.session);
            })
            .then(
                fetch(`${BACKEND}/joinSession/${idSession}`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                }))
            .then(
                fetch(`${BACKEND}/joinSession/${idSession}/users`, {
                    method: 'GET',
                    headers: { 'x-access-token': token },
                })
                    .then(response => response.json())
                    .then(data => {
                        setUsers(data.usersList);
                    })
            )
            .catch(error => alert('Server error: ' + error));
    }, [token, idSession]);

    let usersJSX = null;
    for (let user of users) {
        if (usersJSX === null)
            usersJSX = <SizedText label={user} />;
        else
            usersJSX += <SizedText label={user} />;
    }

    return (
        <View style={[styles.container, commonStyles.container]}>
            <Title label='Récapitulatif de la session' />
            <View style={styles.res}>
                <SizedText label={'Nombre minimal de joueurs:'} />
                <SizedText label={donnees.nbMinJoueurs} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Nombre maximal de joueurs:'} />
                <SizedText label={donnees.nbMaxJoueurs} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Durée d\'une journée en minutes:'} />
                <SizedText label={donnees.dureeJour} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Durée d\'une nuit en minutes:'} />
                <SizedText label={donnees.dureeNuit} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de contamination:'} />
                <SizedText label={donnees.probaC} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité d\'insomnie:'} />
                <SizedText label={donnees.probaI} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de voyance:'} />
                <SizedText label={donnees.probaV} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de spiritisme:'} />
                <SizedText label={donnees.probaS} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Ratio de loups-garou:'} />
                <SizedText label={donnees.probaLG} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Date de début:'} />
                <SizedText label={donnees.debutPartie} />
            </View>
            {
                (showUsers)
                    ? <View style={styles.users}>
                        <Title label='Utilisateurs connectés' />
                        {usersJSX}
                    </View>
                    : null
            }
            <Button containerStyle={styles.usersContainer} size='lg' title=' ' buttonStyle={styles.usersButton} onPress={() => { setShowUsers((showUsers + 1) % 2); }} />
            <View style={styles.idSection}>
                <SizedText size={20} label={'ID session: #'} />
                <SizedText style={styles.id} size={20} label={idSession} />
            </View>

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
    res: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingHorizontal: '20%',
        flexDirection: 'row'
    },
    idSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20
    },
    id: {
        fontWeight: 'bold'
    },
    usersContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 2
    },
    usersButton: {
        backgroundColor: primaryColor,
        paddingHorizontal: 25,
    },
    users: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: backgroundColor,
        zIndex: 1
    }
});