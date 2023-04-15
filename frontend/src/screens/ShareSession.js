// Affichage récapitulatif de la session qui vient d'être créée avec le numéro de l'ID
import { Button } from '@rneui/base';
import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import SizedText from '../components/SizedText';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { backgroundColor, primaryColor } from '../constants/colors';
import { ScreenContext, TokenContext } from '../constants/hooks';
import { vues } from '../constants/screens';
import { commonStyles } from '../constants/style';

export default function ShareSession({ idSession }) {
    const [donnees, setDonnees] = useState({});
    const [showUsers, setShowUsers] = useState(0);
    const [users, setUsers] = useState([]);
    // const [timeLeft, setTimeLeft] = useState(0);

    const changeView = useContext(ScreenContext);
    const token = useContext(TokenContext).token;

    async function loadUsers() {
        await fetch(`${BACKEND}/joinSession/${idSession}/users`, {
            method: 'GET',
            headers: { 'x-access-token': token },
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data.usersList);
            })
            .catch(error => alert(error.message));
    }


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
                })
                    .then((response) => response.json())
                    .then((data) => (data.message === 'Session joined and game started') ? changeView(vues.IN_GAME) : null)
                // .then(
                //     fetch(`${BACKEND}/joinSession/${idSession}/time`, {
                //         method: 'GET',
                //         headers: {
                //             'x-access-token': token,
                //             'Content-Type': 'application/json'
                //         },
                //     })
                //         .then(temps => { setTimeLeft(temps.timeLeft); })
                // )
            )
            .catch(error => alert('Server error: ' + error));
    }, [token, idSession, changeView]);

    let connectedUsers = [];
    for (let user of users)
        connectedUsers.push({ key: user });

    // useEffect(() => {
    //     setTimeout(() => { setTimeLeft(timeLeft - 1); }, 1000);
    // }, [timeLeft]);

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
                <SizedText label={'Durée d\'une journée:'} />
                <SizedText label={`${donnees.dureeJour / 60}h` + ((donnees.dureeJour % 60 != '0') ? `${donnees.dureeJour % 60}min` : '')} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Durée d\'une nuit:'} />
                <SizedText label={`${donnees.dureeNuit / 60}h` + ((donnees.dureeNuit % 60 != '0') ? `${donnees.dureeNuit % 60}min` : '')} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de contamination:'} />
                <SizedText label={donnees.probaC/100} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité d\'insomnie:'} />
                <SizedText label={donnees.probaI/100} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de voyance:'} />
                <SizedText label={donnees.probaV/100} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Probabilité de spiritisme:'} />
                <SizedText label={donnees.probaS/100} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Ratio de loups-garou:'} />
                <SizedText label={donnees.probaLG/100} />
            </View>
            <View style={styles.res}>
                <SizedText label={'Date de début:'} />
                <SizedText label={donnees.debutPartie} />
            </View>
            { // TODO: donnees.debutPartie a changer soon
                (showUsers)
                    ? <View style={styles.users}>
                        <Title label='Utilisateurs connectés' />
                        <View style={styles.list}>
                            <FlatList
                                renderItem={({ item }) => <SizedText style={styles.item} size={20} label={item.key} />}
                                data={connectedUsers}
                                contentContainerStyle={styles.flatListContainer}
                                onTouchStart={loadUsers}
                            />
                        </View>
                    </View>
                    : null
            }
            <Button containerStyle={styles.usersContainer} size='lg' title=' ' buttonStyle={styles.usersButton} onPress={() => { setShowUsers((showUsers + 1) % 2); loadUsers(); }} />
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
        zIndex: 0
    },
    list: {
        marginTop: 25,
        height: '75%',
        width: '100%',
    },
    flatListContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 50
    }
});