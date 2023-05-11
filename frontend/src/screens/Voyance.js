import { useEffect, useContext, useState } from "react";
import Propose from "../components/Propose";
import { TokenContext, CurrentGameView } from '../constants/hooks';
import { FlatList, Pressable, SafeAreaView, StyleSheet } from "react-native";
import Title from "../components/Title";
import { BACKEND } from "../constants/backend";
import { commonStyles } from "../constants/style";
import Bouton from "../components/Bouton";


export default function ChoixVoyance({idSession}) {
    const [proposes, setProposes] = useState([]); //liste des sélectionnables
    const [selectedUser, setSelectedUser] = useState(null); //utilisateur sélectionné
    const [utilise, setUtilise] = useState(false); //précédent usage du pouvoir pendant la nuit
    const [currentJSX, setJSX] = useState(null); //affichage

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    useEffect(()=>{
        /**
         * Requête qui renvoie la liste des joueurs (cf StaticUrne)
         * Pour set proposes
         */
        function fetchJoueurs(){
            setProposes([]);
            fetch(`${BACKEND}/game/${idSession}/alives`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {setProposes(data.aliveUsers)})
                .catch(error => alert(error.message));
            
        }


        /**
         * TODO : Requete qui vérifie si le pouvoir a déjà été utilisé
         * Pour set utilise
         */
        function fetchUsage(){
            // fetch(`${BACKEND}/game/${idSession}/actions/check`, {
            //     method: 'GET',
            //     headers: {
            //         'x-access-token': token,
            //         'Content-Type': 'application/json'
            //     }
            // })
            //     .then(response => response.json())
            //     .then(data => setUtilise(data.status));
        }

        fetchUsage();
        fetchJoueurs();

    },[currentGameView]);

    useEffect(()=>{
        /**
         * Requête qui va récupérer l'ensemble des informations sur le joueur sélectionné
         * (action lorsque l'on valide le choix du joueur)
         */
        function seePlayerInfo(){
            if (selectedUser !== null) {
                fetch(`${BACKEND}/game/${idSession}/actions/voyance`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: '{"victime": "' + selectedUser + '"}' })
                })
                    .then(response => response.json())
                    .then( data => {
                        let role = (data.role==='V')? 'Villageois' : 'Loup-garou';
                        let pouvoir;
                        switch (data.pouvoir){
                            case 'V':
                                pouvoir = 'Voyance'; break;
                            case 'S':
                                pouvoir = 'Spiritisme'; break;
                            case 'I':
                                pouvoir = 'Insomniaque'; break;
                            case 'C':
                                pouvoir = 'Contamination'; break;
                            default:
                                pouvoir = 'Aucun'; break;
                        }
                        alert(
                            'Le joueur '+selectedUser+ ' a comme rôle : '
                            + role + ' et comme pouvoir : ' + pouvoir
                        );
                    }
                    )
                    .catch(error => alert(error.message));
            } else {
                alert('Merci de sélectionner un joueur pour voir son rôle et pouvoir.');
            }
        }


        if(utilise === false){
            const renderItem = ({item}) => {
                return (
                <Pressable onPress={() => setSelectedUser(item)} >
                  <Propose 
                    name={item} 
                    selected={item === selectedUser}
                    />
                </Pressable>
                );
            } ;

            setJSX(
                <SafeAreaView style={styles.container}>
                    <Title label='Voir un joueur'/>
                    <FlatList
                        data={proposes}
                        keyExtractor={item => item}
                        renderItem={renderItem}
                    />
                    <SafeAreaView  style={[commonStyles.bottom, styles.bottom]} >
                            <Bouton label='Sélectionner' onPress={seePlayerInfo}/>
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
    bottom: {
        flexDirection: 'column',
        margin: 2,
        gap: 10
    },

    container: {
        paddingTop: 5,
        flex: 1,
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-around'
    }
    
})