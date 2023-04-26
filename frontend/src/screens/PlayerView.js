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
    const [aliveWerewolves, setAliveWerewolves] = useState([]);

    const token = useContext(TokenContext);
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
            let role = null;
            fetch(`${BACKEND}/user/status`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => role = data.role)
                .catch(error => alert(error.message));
            return role;
        }

        function fetchAliveWerewolves() {
            fetch(`${BACKEND}/game/${idSession}/werewolves`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    let users = [];
                    for (let user of data.werewolves)
                        users.push({ key: user, color: 'orange' });
                    setAliveWerewolves(users);
                })

                .catch(error => alert(error.message));
        }

        if (currentGameView == gameViews.PLAYERS) {
            fetchAliveData();
            fetchDeadData();
            if (fetchUserRole() === 'LG')
                fetchAliveWerewolves();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentGameView]);

    return (
        <FlatList
            renderItem={({ item }) => <SizedText size={20} label={item.key} style={{ color: item.color }} />}
            data={alivePlayers.concat(deadPlayers).concat(aliveWerewolves)}
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