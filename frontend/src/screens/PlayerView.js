import { FlatList, StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { BACKEND } from '../constants/backend';
import { gameViews } from '../constants/screens';
import { CurrentGameView } from '../constants/hooks';
import SizedText from '../components/SizedText';
import { primaryColor } from '../constants/colors';

export default function PlayerView({ idSession }) {
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [deadPlayers, setDeadPlayers] = useState([]);

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
        if (currentGameView == gameViews.PLAYERS) {
            fetchAliveData();
            fetchDeadData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentGameView]);

    return (
        <FlatList
            renderItem={({ item }) => <SizedText size={20} label={item.key} style={{ color: item.color }} />}
            data={alivePlayers.concat(deadPlayers)}
            contentContainerStyle={styles.flatListContainer}  style={styles.flatList}/>
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