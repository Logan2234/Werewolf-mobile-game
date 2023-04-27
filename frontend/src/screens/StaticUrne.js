import { useEffect, useState, useContext } from "react";
import Propose from "../components/Propose";
import { BACKEND } from '../constants/backend';
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { TokenContext, CurrentGameView } from '../constants/hooks';


export default function StaticUrne({idSession}) {
    const token = useContext(TokenContext).token;
    const currentGameView = useContext(CurrentGameView);


    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        /**
         * Requête qui renvoie la liste des personnes proposées pour l'instant
         * 
         */
        function fetchPropose(){
            fetch(`${BACKEND}/game/${idSession}/vote/`, {
                method: 'GET',
                headers: { 'x-access-token': token, 
                'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then((data) => {
                    //setProposes(data.victimes);
                    for (const i in data.victimes){
                        const newVictim = {
                            username: data.victimes[i],
                            votes: data.votesPour[i] - data.votesContre[i]
                        };
                        setProposes(proposes => [...proposes, newVictim]);
                    }
                })
        }

        fetchPropose();
    },[currentGameView]);

    
    const renderItem = ({item}) => {
            <Propose 
                name={item.username} 
                votes={item.votes} 
                selected={item.username === selectedUser}
                />
    };
        

    return(
        <SafeAreaView style={styles.container}>
            <FlatList
            style
            data={proposes}
            keyExtractor={item => item.username}
            renderItem={renderItem}
            />
        </SafeAreaView>
    );

}


const styles = StyleSheet.create({
    
    
    container: {
        paddingTop: 5,
        flex: 1,
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-around'
    }
    
})