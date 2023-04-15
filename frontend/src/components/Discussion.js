import Message from "./Message"
import InputMesssage from "./InputMessage";
import { BACKEND } from '../constants/backend';
import { FlatList } from "react-native";
import { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView } from "react-native";
import { commonStyles } from "../constants/style";
import { secondaryColor } from "../constants/colors";


export default function Discussion({idDiscussion, token, idGame}) {
    const messages=[
        {
            idMessage: '0',
            idJoueur: 'maudmaud',
            message: 'hello bonjhour je mappelle maud et je suis etudiante et jen ai marre',
        },
        {
            idMessage: '1',
            idJoueur: 'logan',
            message: 'Bonjour',
        },
        {
            idMessage: '2',
            idJoueur: 'jorge',
            message: 'Hola',
        }
        
    ];
    // const [loading, setLoading] = useState(false);
    // const [refreshing, setRefreshing] = useState(false);

    
    // /**
    //  * Magie Noire
    //  */
    // useEffect(() => {
    //     const unsubscribe = navigation.addEventListener('focus', () => {
    //     loadMessages();
    //     });
    //     return unsubscribe;
    // },[navigation]);

    // /***
    //  * TODO : A adapter pour notre cas
    //  * [serverUrl, roomId] indique les dépendance => s'actualise quand ça bouge
    //  * modifier le corps mais en gardant la même structure (ne pas mettre de cleaning part)
    //  */
    // useEffect(() => {
    //     const connection = createConnection(serverUrl, roomId);
    //     connection.connect();
    //     return () => {
    //     connection.disconnect();
    //     };
    // }, [serverUrl, roomId]);
    
    // // TODO: Vérifier la requête de récupération des messages (attendre le back)
    // /**
    //  * Lance une requête pour récupérer l'ensemble des messages pour une discussion donnée
    //  */
    // function getMessages(){
    //     fetch(`${BACKEND}/joinSession/${idSession}`, {
    //         method: 'GET',
    //         headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
    //         body: {
    //             idDiscussion
    //         }
    //     })
    //         .then(response => response.json())
    //         .then((data) => {
    //             // format du data ?? (on veut récupérer un array [])
    //             return data;
    //         })
    // }

    // /**
    //  * Récupère les nouveaux messages
    //  */
    // const loadMessages = async () => {
    //     setLoading(true);
    //     const response = await getMessages();
    //     setLoading(false);
    //     if(refreshing) setRefreshing(false);    
    //     setMessages(response.data);
    // };

    const ItemDivider = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: secondaryColor,
              marginVertical: 5
            }}
          />
        );
      }

    /**
     * Renvoie un booléen pour indiquer si on peut envoyer des messages
     */
    function canIWriteHere(){
        fetch(`${BACKEND}/inGame/${idGame}/messages/${idDiscussion}`, {
            method: 'POST',
            headers: {'x-access-token': token,
                     'Content-Type': 'application/json' },
            body: JSON.stringify({ data: '{"message": ""}' })
        })
        .then (() => {return true;})
        .catch( error => {return false;});
    };


    /**
     * Renvoie l'affichage
     * NOTE : il sera intéressant de faire un rendu (et une actualisation uniquement sur la flatList et pas sur l'input)
     */
    if (canIWriteHere()){
        return (
            <View style={styles.container} >
                <FlatList
                    data={messages}
                    // TODO : ne pas balancer l'id mais le pseudo
                    renderItem={({item}) => <Message pseudo={item.idJoueur} text={''} />}
                    keyExtractor={item => item.idMessage}
                    ItemSeparatorComponent={ItemDivider}
                    // TODO : rafraichissement ??
                    //refreshing={true}
                    //onRefresh={() => {loadMessages();}}
                />
                <InputMesssage token={token} idDiscussion={idDiscussion} idGame={idGame}/>
            </View>
        );
    }
    else {
        return (
            <View style={styles.container} >
                <FlatList
                    data={messages}
                    // TODO : ne pas balancer l'id mais le pseudo
                    renderItem={({item}) => <Message pseudo={item.idJoueur} text={item.message} />}
                    keyExtractor={item => item.idMessage}
                    ItemSeparatorComponent={ItemDivider}
                    // TODO : rafraichissement ??
                    //refreshing={true}
                    //onRefresh={() => {loadMessages();}}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 10,
        flexDirection: 'column',
      }
})