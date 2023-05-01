import { useEffect, useContext, useState } from "react";
import Propose from "../components/Propose";
import { TokenContext, CurrentGameView } from '../constants/hooks';
import { FlatList, Pressable, SafeAreaView } from "react-native/types";
import Title from "../components/Title";


export default function ChoixVoyance({idSession}) {
    const [proposes, setProposes] = useState([]); //liste des sélectionnables
    const [selectedUser, setSelectedUser] = useState(null); //utilisateur sélectionné
    const [utilise, setUtilise] = useState(false); //précédent usage du pouvoir pendant la nuit
    const [currentJSX, setJSX] = useState(null); //affichage

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    useEffect(()=>{
        /**
         * TODO: Requête qui renvoie la liste des joueurs (cf StaticUrne)
         * Pour set proposes
         */
        function fetchJoueurs(){}

        /**
         * TODO : Requete qui vérifie si le pouvoir a déjà été utilisé
         * Pour set utilise
         */
        function fetchUsage(){}

        fetchUsage();
        fetchJoueurs();

    },[currentGameView]);

    useEffect(()=>{
        /**
         * Requête qui va récupérer l'ensemble des informations sur le joueur sélectionné
         * (action lorsque l'on valide le choix du joueur)
         */
        function seePlayerInfo(){}


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
                    <Title label='Voir un joueur'/>
                    <FlatList
                        data={proposes}
                        keyExtractor={item => item.username}
                        renderItem={renderItem}
                    />
                    <SafeAreaView  style={[commonStyles.bottom, styles.bottom]} >
                            <Bouton label='Sélectionner' onPress={seePlayerInfo}/>
                    </SafeAreaView>
                </SafeAreaView>
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