import { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import Propose from '../components/Propose';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { TokenContext } from '../constants/hooks';

/**
 * Affichage de l'urne de vote statique avec uniquement les personnes proposées et le nombre de voies contre elles
 *
 * @param {int} idSession
 * @returns
 */
export default function StaticUrne({ idSession }) {
    const token = useContext(TokenContext).token;

    const [currentJSX, setJSX] = useState(null);
    const [proposes, setProposes] = useState([]);

    useEffect(() => {
        /**
         * Requête qui renvoie la liste des personnes proposées pour l'instant
         */
        function fetchPropose() {
            fetch(`${BACKEND}/game/${idSession}/vote`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    for (const i in data.victimes) {
                        const newVictim = {
                            username: data.victimes[i],
                            votes: data.votesPour[i]
                        };
                        setProposes(proposes => [...proposes, newVictim]);
                    }
                });
        }

        setProposes([]);
        fetchPropose();
    }, [idSession, token]);

    useEffect(() => {
        if (proposes.length > 0) {
            const renderItem = ({ item }) => {
                return (
                    <Propose name={item.username} votes={item.votes} selected={false} />
                );
            };

            setJSX(
                <SafeAreaView style={styles.container}>
                    <Title label='Etat actuel des votes' />
                    <FlatList data={proposes} keyExtractor={item => item.username} renderItem={renderItem} />
                </SafeAreaView>
            );
        } else
            setJSX(<Title label='Aucun villageois proposé pour le moment' />);
    }, [proposes]);

    return currentJSX;
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        flex: 1,
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-around'
    }
});