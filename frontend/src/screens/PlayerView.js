import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import SizedText from '../components/SizedText';
import { BACKEND } from '../constants/backend';
import { primaryColor } from '../constants/colors';
import { CurrentGameView, TokenContext } from '../constants/hooks';
import { gameViews } from '../constants/screens';

export default function PlayerView({ idSession }) {
    const [players, setPlayers] = useState(new Set());
    const [players_array, setPlayers_array] = useState([]);
    const [canShow, setCanShow] = useState(false);

    const token = useContext(TokenContext).token;
    const currentGameView = useContext(CurrentGameView);

    useEffect(() => {
        function fetchAliveData() {
            fetch(`${BACKEND}/game/${idSession}/alives`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => { setPlayers(new Set()); return data; })
                .then(data => {
                    for (let user of data.aliveUsers)
                        players.add({ key: user, color: primaryColor });
                })
                .then(fetchDeadData)
                .catch(error => alert(error.message));
        }

        function fetchDeadData() {
            fetch(`${BACKEND}/game/${idSession}/deads`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    for (let user of data.deadUsers)
                        players.add({ key: user, color: 'red' });
                })
                .then(fetchUserRole)
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
                .then(() => setPlayers_array(Array.from(players)))
                .then(() => setCanShow(true))
                .catch(error => alert(error.message));
        }

        function fetchAliveWerewolves() {
            fetch(`${BACKEND}/game/${idSession}/werewolves`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    for (let user of data.werewolves) {
                        players.forEach(item => { if (item.key == user) players.delete(item); });
                        players.add({ key: user, color: 'orange' });
                    }
                })
                .then(() => setPlayers_array(Array.from(players)))
                .catch(error => alert(error.message));
        }

        if (currentGameView == gameViews.PLAYERS) {
            setCanShow(false);
            fetchAliveData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentGameView]);

    return (
        (canShow)
            ? <FlatList data={players_array}
                renderItem={({ item }) => <SizedText size={20} label={item.key} style={{ color: item.color }} />}
                contentContainerStyle={styles.flatListContainer} style={styles.flatList} />
            : <ActivityIndicator style={{ height: '100%' }} size={100} color={primaryColor} />
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