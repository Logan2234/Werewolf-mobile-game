import { useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import Bouton from '../components/Bouton';
import Propose from '../components/Propose';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { TokenContext } from '../constants/hooks';
import { commonStyles } from '../constants/style';
import StaticUrne from './StaticUrne';

/**
 * Affichage pour proposer un joueur au vote
 * 
 * @param {int} idSession 
 * @returns 
 */
export default function Proposition({ idSession }) {
    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentJSX, setJSX] = useState(null);

    const token = useContext(TokenContext).token;
    // TODO : Rajouter un backhandler pour retourner à la ratification

    useEffect(() => {
        /**
         * Renvoie la liste des personnes éligibles restantes dans proposes
         */
        function fetchEligible() {
            fetch(`${BACKEND}/game/${idSession}/vote/free-users`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    setProposes(data.usersNotVictims);
                });
        }

        fetchEligible();
    }, [idSession, token]);

    useEffect(() => {
        const renderItem = ({ item }) => {
            return (
                <Pressable onPress={() => setSelectedUser(item)} >
                    <Propose name={item} selected={item === selectedUser} />
                </Pressable>
            );
        };

        /**
         * Fonction qui envoie sur la page des votes
         */
        function choisir() {
            if (selectedUser !== null) {
                fetch(`${BACKEND}/game/${idSession}/vote/start`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: '{"victime": "' + selectedUser + '"}' })
                })
                    .then(response => response.json())
                    .then(() => setJSX(<StaticUrne idSession={idSession}/>));
            }
        }

        setJSX(
            <SafeAreaView style={styles.container}>
                <Title label='Proposer un joueur' />
                <FlatList data={proposes} renderItem={renderItem} />
                <SafeAreaView>
                    <SafeAreaView style={[commonStyles.bottom, styles.bottom]}>
                        <Bouton label='Choisir' onPress={choisir} />
                    </SafeAreaView>
                </SafeAreaView>
            </SafeAreaView>
        );
    }, [proposes, selectedUser, idSession, token]);

    return currentJSX;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 5,
        flexDirection: 'column',
        flexGrow: 1
    },

    bottom: {
        justifyContent: 'space-between',
        margin: 2
    }
});