import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import SizedText from '../components/SizedText';
import { BACKEND } from '../constants/backend';
import { primaryColor } from '../constants/colors';
import { CurrentGameView, TokenContext } from '../constants/hooks';
import { gameViews } from '../constants/screens';

export default function PlayerView({ idSession }) {
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);

    const token = useContext(TokenContext).token;
    const currentGameView = useContext(CurrentGameView);

    useEffect(() => {
        function fetchAliveData() {
            fetch(`${BACKEND}/game/${idSession}/alives`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    let users = [];
                    for (let user of data.aliveUsers)
                        users.push({ key: user, color: primaryColor });
                    setAlivePlayers(users);
                })
                .catch(error => alert(error.message));
        }

        function fetchDeadData() {
            fetch(`${BACKEND}/game/${idSession}/deads`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    let users = [];
                    for (let user of data.deadUsers)
                        users.push({ key: user, color: 'red' });
                    setDeadPlayers(users);
                })
                .catch(error => alert(error.message));
        }

        function fetchUserRole() {
            fetch(`${BACKEND}/user/status`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => (data.role == 'LG') ? fetchAliveWerewolves() : null)
                .catch(error => alert(error.message));
        }

        function fetchAliveWerewolves() {
            fetch(`${BACKEND}/game/${idSession}/werewolves`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    let users = alivePlayers; // TODO: ATTENTION ON GET LES ID AU LIEU DES USERNAME POUR LE MOMENT
                    for (let user of data.werewolves)
                        if (users.includes({ key: user, color: 'green' })) {
                            let index = users.indexOf({ key: user, color: 'green' });
                            users[index].color = 'orange';
                        }
                    setAlivePlayers(users);
                })

                .catch(error => alert(error.message));
        }

        if (currentGameView == gameViews.PLAYERS) {
            fetchAliveData();
            fetchDeadData();
            fetchUserRole();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentGameView]);

    return (
        <FlatList
            renderItem={({ item }) => <SizedText size={20} label={item.key} style={{ color: item.color }} />}
            data={alivePlayers.concat(deadPlayers)}
            contentContainerStyle={styles.flatListContainer} style={styles.flatList} />
    );
}

const styles = StyleSheet.create({
    flatList: {
        marginTop: 30
    },
    flatListContainer: {
        alignItems: 'center',
        gap: 20,
    }
});