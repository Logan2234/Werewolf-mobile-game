import { useEffect, useState } from "react";
import Propose from "../components/Propose";
import { FlatList, Pressable, SafeAreaView } from "react-native/types";
import Bouton from "../components/Bouton";

export default function ChoixUrne({idSession, token, canVote}) {
    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);


    useEffect(() => {
        /**
         * TODO : Requête qui renvoie la liste des personnes proposées et les met dans proposes
         */
        function fetchPropose(){}

        fetchPropose();
    },[]);

    /**
     * TODO : requête qui permet de voter pour le joueur sélectionné
     */
    async function vote(){}

    /**
     * TODO : fonction qui envoie sur la page des propositions
     */
    async function propose(){}

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
    
    return(
        <SafeAreaView>
            <FlatList
                data={proposes}
                renderItem={renderItem}
            />
            {
                (canVote)
                ? <SafeAreaView>
                    <Bouton label='Voter' onPress={vote}/>
                    <Bouton label='Proposer' onPress={propose}/>
                </SafeAreaView>
                : <></>
            }
            
        </SafeAreaView>
    )
}