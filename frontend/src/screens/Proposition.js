import { useEffect, useState, useContext } from "react";
import Propose from "../components/Propose";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import Bouton from "../components/Bouton";
import { BACKEND } from "../constants/backend";
import { Pressable } from "react-native";
import ChoixUrne from "./ChoixUrne";
import { TokenContext, CurrentGameView } from '../constants/hooks';
import { commonStyles } from "../constants/style";

/**
 * Ecran où on peut choisir de ratifier une proposition
 * @param {*} param0 
 * @returns 
 */
export default function Proposition({idSession}) {
    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentJSX, setJSX] = useState(null);

    const token = useContext(TokenContext).token;
    // TODO : Rajouter un backhandler pour retourner au vote


    useEffect(()=>{
        /**
         * Renvoie la liste des personnes éligibles restantes dans proposes
         */
        function fetchEligible(){
        fetch(`${BACKEND}/game/${idSession}/vote/free-users`, {
            method: 'GET',
            headers: { 'x-access-token': token, 
            'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then((data) => {
                setProposes(data.usersNotVictims);
            })
        }
        
        fetchEligible();
    } ,[CurrentGameView]);

    useEffect(() => { 
        const renderItem = ({item}) => {
            return (
                <Pressable onPress={() => setSelectedUser(item)} >
                <Propose 
                  name={item}  
                  selected={item === selectedUser}
                  />
              </Pressable>
            );
          };
        //TODO : ajouter un titre en haut
        //TODO : foutre ce bouton en bas
        setJSX(
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={proposes}
                    renderItem={renderItem}
                />
                <SafeAreaView>
                    <SafeAreaView style={[commonStyles.bottom, styles.bottom]}>
                        <Bouton label='Choisir' onPress={choisir} />
                    </SafeAreaView>
                </SafeAreaView>
            </SafeAreaView>
        )
    },[proposes,selectedUser]);
    
    /**
     * Fonction qui envoie sur la page des votes
     */
    function choisir(){
        fetch(`${BACKEND}/game/${idSession}/vote/start`, {
            method: 'POST',
            headers: { 'x-access-token': token, 
            'Content-Type': 'application/json' },
            body: JSON.stringify({data: '{"victime": "'+ selectedUser +'"}'})
        })
            .then(response => response.json())
            .then(()=>setJSX(<ChoixUrne idSession={idSession} token={token} canVote={false}/> ))

    }



    return(currentJSX);
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

})