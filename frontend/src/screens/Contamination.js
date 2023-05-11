import { useEffect, useContext, useState } from "react";
import Propose from "../components/Propose";
import { TokenContext, CurrentGameView } from '../constants/hooks';
import { FlatList, Pressable, SafeAreaView } from "react-native/types";
import Title from "../components/Title";


export default function Contamination({idSession}) {
    const [proposes, setProposes] = useState([]); //liste des sélectionnables
    const [selectedUser, setSelectedUser] = useState(null); //utilisateur sélectionné
    const [utilise, setUtilise] = useState(false); //précédent usage du pouvoir pendant la nuit
    const [currentJSX, setJSX] = useState(null); //affichage

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    useEffect(()=>{
        /**
         * TODO: Requête qui renvoie la liste des joueurs humains (cf StaticUrne)
         * Pour set proposes
         */
        function fetchHumains(){}

        /**
         * TODO : Requete qui vérifie si le pouvoir a déjà été utilisé
         * Pour set utilise
         */
        function fetchUsage(){}

        fetchUsage();
        fetchHumains();

    },[currentGameView]);

    useEffect(()=>{
        /**
         * Requête qui va contaminer le joueur
         * (action lorsque l'on valide le choix du joueur)
         */
        function contaminer(){
            if (selectedUser !== null) {
                fetch(`${BACKEND}/game/${idSession}/actions/contamination`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: '{"victime": "' + selectedUser + '"}' })
                })
                    .then(response => response.json())
                    .catch(error => alert(error.message));
            }
        }


        if(utilise === false){
            const renderItem = ({item}) => {
                return (
                <Pressable onPress={() => setSelectedUser(item.username)} >
                  <Propose 
                    name={item.username} 
                    selected={item.username === selectedUser}
                    />
                </Pressable>
                );
            } ;

            setJSX(
                <SafeAreaView>
                    <Title label='Contaminer un joueur'/>
                    <FlatList
                        data={proposes}
                        keyExtractor={item => item.username}
                        renderItem={renderItem}
                    />
                    <SafeAreaView  style={[commonStyles.bottom, styles.bottom]} >
                            <Bouton label='Sélectionner' onPress={contaminer}/>
                    </SafeAreaView>
                </SafeAreaView>
            );
        } else {
            setJSX(
                <Title label='POUVOIR DEJA UTILISE'/>
            );
        }
    },[selectedUser, currentGameView, proposes, utilise]);
    
    return(currentJSX);
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