import { useEffect, useState } from "react";
import Propose from "../components/Propose";
import Proposition from "./Proposition";
import { BACKEND } from '../constants/backend';
import { FlatList, Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import Bouton from "../components/Bouton";

export default function ChoixUrne({idSession, token, canVote}) {
    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [ratifie, setRatifie] = useState(true);

    useEffect(() => {
        /**
         * Requête qui renvoie la liste des personnes proposées et les met dans proposes
         * !TODO : à fix (faire fonction pour reformatter le data avec username et nb de vote)
         */
        function fetchPropose(){
            fetch(`${BACKEND}/game/${idSession}/vote/`, {
                method: 'GET',
                headers: { 'x-access-token': token, 
                'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then((data) => {
                    setProposes(data.victimes);
                })
        }

        fetchPropose();
    },[]);

    /**
     * TODO : requête qui permet de voter pour le joueur sélectionné
     */
    async function vote(){}

    /**
     * TODO : fonction qui envoie sur la page des propositions
     */
    function propose(){
        setRatifie(false);
    }

    const renderItem = ({item}) => {
        if (canVote){
            return (
            <Pressable onPress={() => setSelectedUser(item.username)} >
              <Propose 
                name={item.username} 
                votes={item.votes} 
                selected={item.username === selectedUser}
                />
            </Pressable>
            );
        } else {
            return (<Propose 
                name={item.username} 
                votes={item.votes} 
                selected={item.username === selectedUser}
                />
            );
        }
      };
    if (ratifie){
        if (canVote){
            return(
                <SafeAreaView style={styles.container}>
                    <FlatList
                        style
                        data={proposes}
                        keyExtractor={item => item.username}
                        renderItem={renderItem}
                    />
                    <SafeAreaView  style={styles.bottom} >
                            <Bouton label='Voter' onPress={vote}/>
                            <Bouton label='Proposer' onPress={propose}/>
                    </SafeAreaView>
                </SafeAreaView>
            );
        } else {
            return (
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
    } else {
        return(
            <Proposition idSession={idSession} token={token}/>
        );
    }

}


const styles = StyleSheet.create({
    bottom: {
        position: 'absolute', // TODO  :ça marche paaaaaaas
        bottom: 0,
        top: 90,
        width: '95%',
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        margin: 2,
        gap: 10,
        alignSelf: 'center',
        backgroundColor: 'blue',
    },
    
    
    container: {
        paddingTop: 5,
        flex: 1,
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-around'
    }
    
});