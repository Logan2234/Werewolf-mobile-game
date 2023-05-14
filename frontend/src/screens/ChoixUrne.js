import { useContext, useEffect, useState } from 'react';
import { BackHandler, FlatList, Pressable, SafeAreaView, StyleSheet, Vibration } from 'react-native';
import Bouton from '../components/Bouton';
import Propose from '../components/Propose';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { TokenContext } from '../constants/hooks';
import { commonStyles } from '../constants/style';
import Proposition from './Proposition';
import StaticUrne from './StaticUrne';

/**
 * Affichage pour voter ou proposer quelqu'un au vote
 *
 * @param {int} idSession
 * @returns
 */
export default function ChoixUrne({ idSession }) {
    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [action, setAction] = useState(true);
    const [currentJSX, setJSX] = useState(null);

    const token = useContext(TokenContext).token;

    useEffect(() => {
        /**
         * Requête qui renvoie la liste des personnes proposées et les met dans proposes
         *  TODO : actualiser l'affichage via websocket sur l'ajout des votes
         */
        function fetchPropose() {
            fetch(`${BACKEND}/game/${idSession}/vote/`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    setProposes([]);
                    for (const i in data.victimes) {
                        const newVictim = {
                            username: data.victimes[i],
                            votes: data.votesPour[i]
                        };
                        setProposes(proposes => [...proposes, newVictim]);
                    }
                })
                .catch(error => alert(error.message));
        }
        fetchPropose();
    }, [idSession, token]);

    useEffect(() => {
        /**
     * Requête qui permet de voter pour le joueur sélectionné
        */
        function vote() {
            setAction(false);
            if (selectedUser != null) {
                fetch(`${BACKEND}/game/${idSession}/vote/`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: '{"victime": "' + selectedUser + '"}' })
                })
                    .then(response => response.json())
                    .then(() => setJSX(<StaticUrne idSession={idSession} />))
                    .catch(error => alert(error.message));
            }
        }

        /**
         * Fonction qui indique que l'on va sur la page des propositions
         */
        function propose() {
            setAction(false);
            setJSX(<Proposition idSession={idSession} />);
        }

        const renderItem = ({ item }) => {
            return (
                <Pressable onPress={() => setSelectedUser(item.username)} >
                    <Propose name={item.username} votes={item.votes} selected={item.username === selectedUser} />
                </Pressable>
            );
        };

        if (action) {
            setJSX(
                <SafeAreaView style={styles.container}>
                    <Title label='Ratifer une décision' />
                    <FlatList data={proposes} keyExtractor={item => item.username} renderItem={renderItem} />
                    <SafeAreaView style={[commonStyles.bottom, styles.bottom]} >
                        <Bouton label='Voter' onPress={vote} />
                        <Bouton label='Proposer' onPress={propose} />
                    </SafeAreaView>
                </SafeAreaView>
            );
        }

    }, [idSession, token, action, selectedUser, proposes]);

    useEffect(() => {
        const backActionHandler = () => {
            if (!action) {
                setAction(true);
                Vibration.vibrate(10);
                return true;
            }
        };

        BackHandler.addEventListener('hardwareBackPress', backActionHandler);
        return () => BackHandler.removeEventListener('hardwareBackPress', backActionHandler);
    });

    return currentJSX;
}

const styles = StyleSheet.create({
    bottom: {
        flexDirection: 'column',
        margin: 2,
        gap: 10
    },

    container: {
        paddingTop: 5,
        flex: 1,
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-around'
    }
});