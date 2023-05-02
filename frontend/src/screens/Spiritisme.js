import { useEffect, useContext, useState } from "react";
import Propose from "../components/Propose";
import { TokenContext, CurrentGameView } from '../constants/hooks';
import { FlatList, Pressable, SafeAreaView } from "react-native/types";
import Title from "../components/Title";


export default function ChoixSpiritisme({idSession}) {
    const [proposes, setProposes] = useState([]); //liste des sélectionnables
    const [selectedUser, setSelectedUser] = useState(null); //utilisateur sélectionné
    const [utilise, setUtilise] = useState(false); //précédent usage du pouvoir pendant la nuit
    const [currentJSX, setJSX] = useState(null); //affichage

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    useEffect(()=>{
        /**
         * Requête qui renvoie la liste des joueurs morts
         * Pour set proposes
         * TODO : à tester
         */
        function fetchDeads(){
            fetch(`${BACKEND}/game/${idSession}/deads`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => setProposes(data.deadUsers))
                .catch(error => alert(error.message));
        }

        /**
         * TODO : Requete qui vérifie si le pouvoir a déjà été utilisé
         * Pour set utilise
         */
        function fetchUsage(){}

        fetchUsage();
        fetchDeads();

    },[currentGameView]);

    useEffect(()=>{
        /**
         * Requête qui va sélectionner un joueur pour parler la nuit
         * (action lorsque l'on valide le choix du joueur)
         * TODO : à tester 
         */
        function discute(){
            if (selectedUser !== null){
                fetch(`${BACKEND}/game/${idSession}/action/spiritism`, {
                    method: 'POST',
                    headers: { 'x-access-token': token, 
                    'Content-Type': 'application/json' },
                    body: JSON.stringify({data: '"victime": "' + selectedUser + '"}'})
                })
                    .then(response => response.json())
                    .catch(error => alert(error.message));
            }
        }


        if(utilise === false){

            if (proposes.length > 0){
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
                        <Title label='Parler à un joueur mort'/>
                        <FlatList
                            data={proposes}
                            keyExtractor={item => item.username}
                            renderItem={renderItem}
                        />
                        <SafeAreaView  style={[commonStyles.bottom, styles.bottom]} >
                                <Bouton label='Sélectionner' onPress={discute}/>
                        </SafeAreaView>
                    </SafeAreaView>
                );
            } else {
                setJSX(
                    <Title label='Aucun mort pour le moment'/>
                )
            }
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