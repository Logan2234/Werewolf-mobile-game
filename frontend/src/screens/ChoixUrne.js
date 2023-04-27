import { useEffect, useState, useContext } from "react";
import Propose from "../components/Propose";
import Proposition from "./Proposition";
import { BACKEND } from '../constants/backend';
import { FlatList, Pressable, SafeAreaView, StyleSheet } from "react-native";
import Bouton from "../components/Bouton";
import StaticUrne from "./StaticUrne";
import { TokenContext, CurrentGameView } from '../constants/hooks';


export default function ChoixUrne({idSession}) {
    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [ratifie, setRatifie] = useState(true);
    const [currentJSX, setJSX] = useState(null);

    const token = useContext(TokenContext).token;
    const currentGameView = useContext(CurrentGameView);

    useEffect(() => {
        /**
         * Requête qui renvoie la liste des personnes proposées et les met dans proposes
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
                    setProposes([]);
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
    
    useEffect(()=>{
        /**
         * Requête qui permet de voter pour le joueur sélectionné
         */
        function vote(){
            fetch(`${BACKEND}/game/${idSession}/vote/`, {
                method: 'POST',
                headers: { 'x-access-token': token, 
                'Content-Type': 'application/json' },
                body: JSON.stringify({data: '{"victime": "'+ selectedUser +'", "decision":"true"}'})
            })
                .then(response => response.json())
                .then(()=>setJSX(<StaticUrne idSession={idSession}/> ))
    
        }
    
        /**
         * Fonction qui indique que l'on va sur la page des propositions
         */
        function propose(){
            setRatifie(false);
            setJSX(<Proposition idSession={idSession} token={token}/>);
        }
    
        const renderItem = ({item}) => {
                return (
                <Pressable onPress={() => setSelectedUser(item.username)} >
                  <Propose 
                    name={item.username} 
                    votes={item.votes} 
                    selected={item.username === selectedUser}
                    />
                </Pressable>
                );
            } ;
    
        if (ratifie){
            setJSX(
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
        }

    },[ratifie, selectedUser, currentGameView, proposes])


    return(currentJSX);

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