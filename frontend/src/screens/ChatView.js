import { FlatList, View } from 'react-native';
import Title from '../components/Title';
import Bouton from '../components/Bouton'
import DiscussionVillage from './DiscussionVillage';
import DiscussionRepere from './DiscussionRepere';
import DiscussionSpiritisme from './DiscussionSpiritisme';
import { useContext, useState } from 'react';
import { TokenContext } from '../constants/hooks';



export default function ChatView({idGame}) {
    // ------------------------ Constantes -------------------------
    const token = useContext(TokenContext).token;
    // NOTE : Initialiser à la main pour les tests
    const [listeChat, setChats] = useState([]);
    const [moment, setMoment] = useState('N');
    const [userData, setUserData] = useState({});


    // ------------------------ Fonction pour factorise le code -------------------------
    /**
     * Récupère les constantes dans le back
     * TODO : raffraichissement à reprendre (?) + test des requêtes
     */
    useEffect(() => {
        async function fetchUserData() {
            await fetch(`${BACKEND}/user/status`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => { setUserData(data); })
                .catch(error => alert(error.message));
        }

        async function fetchMomentData() {
            await fetch(`${BACKEND}/game/${idSession}/info`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => { setMoment(data.moment); })
                .catch(error => alert(error.message));
        }
        fetchUserData();
        fetchMomentData();
    }, [token, idGame]);


    /**
     * Ajoute le fil à listeChat sans écraser ce qui a été précédemment demander
     */
    function addChat(nom, id, onPress){
        setChats((prevChats) => [
            prevChats,
            {
                id: {id},
                nom: {nom},
                affichage: {onPress}
            }
        ]);
    }

    /**
     * Renvoie un array avec toutes les discussions accessibles
     * pour le token donné et le jeu donné
     */
    function getSeeableChats(){
        setChats([]); // On vide dans le cas où les constantes ont changé depuis le dernier appel
        if (statut === 'M') { // si on est mort, on a les trois salons disponibles (avec ou sans accès)
            addChat('Repère des Loups-garous', 0, () => 
                {return(<DiscussionRepere token={token} idGame={idGame} />);});
            addChat('Salle de spiritisme', 1, () => 
                {return(<DiscussionSpiritisme token={token} idGame={idGame} />);});
            addChat('Place du village', 2, () => 
                {return(<DiscussionVillage token={token} idGame={idGame} />);}); 
        } else {
            if (moment === 'N'){ // la nuit, deux salons sont disponibles
                if (userData.role === 'LG' || userData.pouvoir === 'I') {
                    addChat('Repère des Loups-garous', 0,() => 
                        {return(<DiscussionRepere token={token} idGame={idGame} />);})
                }
                if (userData.pouvoir === 'S') {
                    addChat('Salle de spiritisme', 1, () => 
                        {return(<DiscussionSpiritisme token={token} idGame={idGame} />);})
                }
            } else { // le jour, seule la place du village est accessible
                addChat('Place du village', 2, () => 
                    {return (<DiscussionVillage token={token} idGame={idGame} />);})
            }
        }
    }

    // ------------------------ Reformattage des discussions -------------------------
    setChats(getSeeableChats());
    for (let chatToUpdate in listeChat){
        const formattedChat = transformChat(chat);
        setChats(
            listeChat.map((chat) =>
                chat.id === chatToUpdate.id
                    ? { formattedChat}
                    : { chat }
            )
        );
    }

    // ------------------------ Affichage des discussions -------------------------
    if (listeChat.length === 0) {
        // Cas où on est un villageois de nuit qui n'est ni Insomniaque, ni Spiritiste
        return (
            <Title label='AUCUNE DISCUSSION DISPONIBLE POUR L&acop;INSTANT' />
        )
    } else {
        return (
                //<DiscussionVillage token={token} idGame={idGame} />
                <View style={styles.container}>
                    <FlatList
                        data = {listeDiscussion}
                        renderItem = {({chat}) => <Bouton style={null} label={chat.nom} onPress={chat.affichage}/>}
                        keyExtractor = {chat => chat.id}
                        // TODO : raffraichissement à la fin de chaque période J/N + fin de vote (car changement des accès)
                        // \---> cf Discussion.js quand il sera fait
                    />
                </View>
    
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        flexDirection: 'column',
        justifyContent: 'space-around'
      }
})
