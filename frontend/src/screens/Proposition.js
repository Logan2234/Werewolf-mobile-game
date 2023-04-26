import { useEffect, useState } from "react";
import Propose from "../components/Propose";
import { FlatList, SafeAreaView } from "react-native/types";
import Bouton from "../components/Bouton";
import SizedText from "../components/SizedText";

/**
 * Ecran où on peut choisir de ratifier une proposition
 * @param {*} param0 
 * @returns 
 */
export default function ChoixUrne({idSession, token}) {
    const [proposes, setProposes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);


    useEffect(() => {
        /**
         * Renvoie la liste des personnes éligibles restantes dans proposes
         */
        function fetchEligible(){}

        fetchEligible();
    },[]);

    /**
     * TODO : fonction qui envoie le vote/start
     * TODO : fonction qui envoie sur la page des votes
     */
    async function choisir(){}

    const renderItem = ({item}) => {
        return (
            <Pressable onPress={() => setSelectedUser(item.username)} >
            <Propose 
              name={item.username}  
              selected={item.username === selectedUser}
              />
          </Pressable>
        );
      };
    
    return(
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
}