import { useEffect, useState, useContext } from "react";
import Propose from "../components/Propose";
import { FlatList, SafeAreaView } from "react-native";
import Bouton from "../components/Bouton";
import { BACKEND } from "../constants/backend";
import { Pressable } from "react-native";
import ChoixUrne from "./ChoixUrne";
import { TokenContext, CurrentGameView } from '../constants/hooks';


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
    // TODO : Rajouter un backhandler


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
    } ,[]);

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
        setJSX(
            <SafeAreaView>
                <FlatList
                    data={proposes}
                    renderItem={renderItem}
                />
                <SafeAreaView>
                    <Bouton label='Choisir' onPress={choisir}/> //TODO : foutre ce bouton en bas
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