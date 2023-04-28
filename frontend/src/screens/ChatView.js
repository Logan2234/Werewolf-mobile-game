import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import Title from '../components/Title';
import Bouton from '../components/Bouton'
import DiscussionVillage from './DiscussionVillage';
import { BACKEND } from '../constants/backend';
import DiscussionRepere from './DiscussionRepere';
import DiscussionSpiritisme from './DiscussionSpiritisme';
import { useContext, useEffect, useState } from 'react';
import { TokenContext, CurrentGameView } from '../constants/hooks';
import { primaryColor } from '../constants/colors';



export default function ChatView({idSession}) {
    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;
    
    const [selectedChat, selectChat] = useState(0);
    const [currentChatJSX, changeChatJSX] = useState(null);

    const [listeChats, setChats] = useState([]);
    const [moment, setMoment] = useState('N');
    const [userData, setUserData] = useState({});
    const [canShow, setCanShow] = useState(false);

    // -----Récupération des données du jeu-------
    useEffect(()=>{
        /**
         * Ajoute le fil à listeChats sans écraser ce qui a été précédemment demander
         */
        function addChat(nom, id, onPress){
            const elementToAdd = {id: id,
                                nom: nom,
                                affichage: onPress} 
            if (listeChats.includes({elementToAdd})){
                console.log(nom + ' already added')
                return;
            }
            setChats(chat => [  ...chat,
                            elementToAdd  
                            ]);
            console.log(nom + ' added to seeable chats')
        }
        
        /**
         * Renvoie un array avec toutes les discussions accessibles
         * pour le token donné et le jeu donné
         */
        function getSeeableChats(){
            setChats([]); // On vide dans le cas où les constantes ont changé depuis le dernier appel
            if (userData.statut === 'M') { // si on est mort, on a les trois salons disponibles (avec ou sans accès)
                addChat('Repère des Loups-garous', 1, () => {selectChat(1);});
                addChat('Salle de spiritisme', 2, () => {selectChat(2);});
                addChat('Place du village', 3, () => {selectChat(3);});
            } else { // si on est vivant
                if (moment === 'N'){ // la nuit, deux salons sont disponibles
                    if (userData.role === 'LG' || userData.pouvoir === 'I') {
                        addChat('Repère des Loups-garous', 1,() => {selectChat(1);});
                    }
                    if (userData.pouvoir === 'S') {
                        addChat('Salle de spiritisme', 2, () => {selectChat(2);});
                    }
                } else { // le jour, seule la place du village est accessible
                    addChat('Place du village', 3, () => {selectChat();});
                }
            }
        }

        /**
         * Récupère les données de l'utilisateur pour déterminer ses droits
         */
        function fetchUserData() {
            fetch(`${BACKEND}/user/status`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => { 
                setUserData({
                    statut: data.vie,
                    pouvoir: data.pouvoir,
                    role: data.role
                }); 
            })
            .catch(error => alert(error.message));
        }
        
        /**
         * Récupère le moment de la journée pour déterminer les salles disponibles
         */
        function fetchMomentData() {
            fetch(`${BACKEND}/game/${idSession}/info`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => setMoment(data.gameInfo.moment))
            .then(() => setCanShow(true))
            .catch(error => alert(error.message));
        }
        
        
        fetchUserData();
        fetchMomentData();
        getSeeableChats();
        
    },[currentGameView]);
    

    // -----Mise en place des chats visibles-------
    useEffect(()=>{
    
        function setViewChat() {
            switch (selectedChat) {
                case 0: //vue des chats disponibles
                changeChatJSX(<FlatList
                        data = {listeChats}
                        renderItem = {(item) => {
                            return(<Bouton  style={styles.bouton} 
                                            label={item.item.nom} 
                                            onPress={item.item.affichage}/>);}}
                        keyExtractor = {chat => chat.id}
                    />);
                    break;
                    
                case 1:
                    changeChatJSX(<DiscussionRepere token={token} idSession={idSession} />); break;
                case 2:
                    changeChatJSX(<DiscussionSpiritisme token={token} idSession={idSession} />); break;
                case 3:
                    changeChatJSX(<DiscussionVillage token={token} idSession={idSession} />); break;    
            }
        }
        setViewChat();
                    
    }, [selectedChat, currentGameView, listeChats, canShow])
    
    // -----Affichage des boutons-------
    if (listeChats.length === 0) {
        // Cas où on est un villageois de nuit qui n'est ni Insomniaque, ni Spiritiste
        return (
            <Title label='AUCUNE DISCUSSION DISPONIBLE POUR L&apos;INSTANT' />
        )
    } else {
        return (
                <View style={styles.container}>
                    {
                        (canShow)
                            ? currentChatJSX
                            
                            : <ActivityIndicator style={ {height: '100%'}} size={100} color={primaryColor} />
                    } 
                </View>
    
            );
    }    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
      },
    
    bouton:{
        margin: '1%',
    }
})
