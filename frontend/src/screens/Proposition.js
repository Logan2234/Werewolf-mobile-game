import { useEffect, useState } from "react";
import Propose from "../components/Propose";
import { FlatList, SafeAreaView } from "react-native";
import Bouton from "../components/Bouton";
import SizedText from "../components/SizedText";
import { BACKEND } from "../constants/backend";
import { Pressable } from "react-native";
import ChoixUrne from "./ChoixUrne";

/**
 * Ecran où on peut choisir de ratifier une proposition
 * @param {*} param0 
 * @returns 
 */
export default function Proposition({idSession, token}) {
    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentJSX, setJSX] = useState(null);


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
        
        setJSX(
            <SafeAreaView>
                <FlatList
                    data={proposes}
                    renderItem={renderItem}
                />
                <SafeAreaView>
                    <Bouton label='Choisir' onPress={choisir}/>
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