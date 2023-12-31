// Affichage récapitulatif de la session qui vient d'être créée avec le numéro de l'ID
import { Button, Icon } from '@rneui/base';
import { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import SizedText from '../components/SizedText';
import Title from '../components/Title';
import { BACKEND, WEBSOCKET } from '../constants/backend';
import { backgroundColor, primaryColor } from '../constants/colors';
import { ScreenContext, TokenContext } from '../constants/hooks';
import { views } from '../constants/screens';
import { commonStyles } from '../constants/style';

/**
 * Vues qui va gérer la salle d'attente d'une partie
 *
 * @param {int} idSession
 * @returns
 */
export default function ShareSession({ idSession }) {
    const [donnees, setDonnees] = useState({});
    const [users, setUsers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [timeLeftFormatted, setTimeLeftFormatted] = useState({});
    const [showUsers, setShowUsers] = useState(false);
    const [canShow, setCanShow] = useState(false);

    const changeView = useContext(ScreenContext);
    const token = useContext(TokenContext).token;
    const ws = useRef(new WebSocket(WEBSOCKET)).current;

    useEffect(() => {
        function getSessionData() {
            fetch(`${BACKEND}/joinSession/${idSession}`, {
                method: 'GET',
                headers: { 'x-access-token': token },
            })
                .then(response => response.json())
                .then(data => setDonnees(data.session))
                .catch(error => alert('Server error: ' + error));
        }

        function getTimeRemaining() {
            fetch(`${BACKEND}/joinSession/${idSession}/time`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => { setTimeLeft(data.timeLeft); })
                .catch(error => alert('Server error: ' + error));
        }

        function getUsername() {
            fetch(`${BACKEND}/whoami`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => { return data.username; })
                .then(username => ws.send(JSON.stringify({ player: username, idSession: idSession })))
                .then(loadUsers)
                .catch(error => alert('Server error: ' + error));
        }

        function loadUsers() {
            fetch(`${BACKEND}/joinSession/${idSession}/users`, {
                method: 'GET',
                headers: { 'x-access-token': token },
            })
                .then(response => response.json())
                .then(data => setUsers((users) => users.concat(data.usersList)))
                .then(sendUserData)
                .catch(error => alert(error.message));
        }

        function sendUserData() {
            fetch(`${BACKEND}/joinSession/${idSession}`, {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
            })
                .then((response) => response.json())
                // .then((data) => (data.message === 'Session joined and game started') ? changeView(views.IN_GAME) : null) // In case it's the last player
                .catch(error => alert('Server error: ' + error));
        }

        getSessionData();
        getTimeRemaining();
        getUsername();
    }, [token, idSession, changeView]);

    useEffect(() => {
        ws.onerror = (e) => {
            console.log(e);
        };
        ws.onmessage = (e) => {
            let newUser = (JSON.parse(e.data).idSession == idSession.toString()) ? JSON.parse(e.data).player : null;
            if (newUser != null && !users.includes(newUser))
                setUsers((users) => [...users, newUser]);
        };
    }, []);

    useEffect(() => {
        if (users.length == donnees.nbMaxJoueurs)
            setTimeout(() => changeView(views.IN_GAME), 2000);
    }, [users, donnees, changeView]);

    useEffect(() => {
        function computeTimeLeft() {
            let secondes = timeLeft / 1000;
            let minutes = secondes / 60;
            let heures = minutes / 60;
            const jours = parseInt(heures / 24);
            heures = parseInt(heures - 24 * jours);
            minutes = parseInt(minutes - 60 * heures - 24 * jours);
            secondes = parseInt(secondes - 60 * minutes - 60 * heures * 60 - 24 * jours * 60 * 60);
            setTimeLeftFormatted({ jours: jours, heures: heures, minutes: minutes, secondes: secondes });
            if (!canShow)
                setCanShow(true);
        }

        if (timeLeft != null) {
            if (timeLeft <= 0)
                changeView(views.IN_GAME);
            setTimeout(() => { setTimeLeft(timeLeft - 1000); computeTimeLeft(); }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    let connectedUsers = [];
    for (let user of users)
        connectedUsers.push({ key: user });

    return (
        <View style={[styles.container, commonStyles.container]}>
            <Title label='Récapitulatif de la session' />
            {
                (canShow)
                    ? <>
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
                            <SizedText label={((parseInt(donnees.dureeJour / 60 / 60 / 1000) != '0') ? `${parseInt(donnees.dureeJour / 60 / 60 / 1000)}h` : '') + ((donnees.dureeJour / 60 / 1000 % 60 != '0') ? `${donnees.dureeJour / 60 / 1000 % 60}min` : '')} />
                        </View>
                        <View style={styles.res}>
                            <SizedText label={'Durée d\'une nuit:'} />
                            <SizedText label={((parseInt(donnees.dureeNuit / 60 / 60 / 1000) != '0') ? `${parseInt(donnees.dureeNuit / 60 / 60 / 1000)}h` : '') + ((donnees.dureeNuit / 60 / 1000 % 60 != '0') ? `${donnees.dureeNuit / 60 / 1000 % 60}min` : '')} />
                        </View>
                        <View style={styles.res}>
                            <SizedText label={'Probabilité de contamination:'} />
                            <SizedText label={donnees.probaC / 100} />
                        </View>
                        <View style={styles.res}>
                            <SizedText label={'Probabilité d\'insomnie:'} />
                            <SizedText label={donnees.probaI / 100} />
                        </View>
                        <View style={styles.res}>
                            <SizedText label={'Probabilité de voyance:'} />
                            <SizedText label={donnees.probaV / 100} />
                        </View>
                        <View style={styles.res}>
                            <SizedText label={'Probabilité de spiritisme:'} />
                            <SizedText label={donnees.probaS / 100} />
                        </View>
                        <View style={styles.res}>
                            <SizedText label={'Ratio de loups-garous:'} />
                            <SizedText label={donnees.probaLG / 100} />
                        </View>
                        <View style={styles.res}>
                            <SizedText label={'Date de début: '} />
                            <SizedText label={timeLeftFormatted.jours + 'j ' + timeLeftFormatted.heures + 'h ' + timeLeftFormatted.minutes + 'min ' + timeLeftFormatted.secondes + 's'} />
                        </View>
                    </>
                    : <ActivityIndicator size={100} color={primaryColor} />
            }
            {
                (showUsers)
                    ? <View style={styles.users}>
                        <Title label='Utilisateurs connectés' />
                        <View style={styles.list}>
                            <FlatList
                                renderItem={({ item }) => <SizedText size={20} label={item.key} />}
                                data={connectedUsers}
                                contentContainerStyle={styles.flatListContainer}
                            />
                        </View>
                    </View>
                    : null
            }
            <Button containerStyle={styles.usersContainer} size='lg' icon={<Icon name='people' color='white' />} buttonStyle={styles.usersButton} onPress={() => setShowUsers(!showUsers)} />
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
        bottom: 5,
        right: 5,
        zIndex: 2,
        borderRadius: 30,
        borderColor: 'rgba(1, 1, 1, 0.1)',
        borderWidth: 3,
    },

    usersButton: {
        backgroundColor: backgroundColor,
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