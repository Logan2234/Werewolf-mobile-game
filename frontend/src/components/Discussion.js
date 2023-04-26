import Message from "./Message"
import InputMessage from "./InputMessage";
import { BACKEND } from '../constants/backend';
import { FlatList } from "react-native";
import { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { commonStyles } from "../constants/style";
import { secondaryColor } from "../constants/colors";
import { TokenContext, CurrentGameView } from '../constants/hooks';


export default function Discussion({idDiscussion, token, idSession}) {
    const currentGameView = useContext(CurrentGameView);
    const [canWrite, setWriting] = useState(false);
    const [messages, setMessages] = useState([]);



    useEffect(()=>{
        /**
         * Renvoie un booléen pour indiquer si on peut envoyer des messages 
         * ! Requête sera à revoir (:
         */
        function canIWriteHere(){
            // fetch(`${BACKEND}/game/${idSession}/messages/${idDiscussion}`, {
            //     method: 'POST',
            //     headers: {'x-access-token': {token},
            //             'Content-Type': 'application/json' },
            //     body: JSON.stringify({ data: '{"message": "a"}' })
            // })
            // .then(response => response.json())
            // .then (() => {
            //     setWriting(true);
            //     console.log("I am allowed write here");})
            // .catch( error => {
            //     setWriting(false);
            //     console.log("I am not allowed write here")});
            setWriting(true);        
        };

        /**
         * Lance une requête pour récupérer l'ensemble des messages pour une discussion donnée
         */
        function getMessages(){
            fetch(`${BACKEND}/game/${idSession}/messages/${idDiscussion}`, {
                method: 'GET',
                headers: { 'x-access-token': token, 
                'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then((data) => {
                    setMessages(data.messages);
                })
        }

        canIWriteHere();
        getMessages();

    },[token, currentGameView, canWrite])
    // TODO: rafraichissement actuellement au changement de page
    
;

    /**
     * 
     * @returns cute JSX Divider between messages
     */
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
     * Renvoie l'affichage
     * 
     */
    // TODO : rajouter un retour en arrière
    if (canWrite) {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    style = {styles.flat}
                    data = {messages}
                    renderItem={({item}) => <Message pseudo={item.username} text={item.message} />}
                    keyExtractor={item => item.timePosted}
                    ItemSeparatorComponent={ItemDivider}
                />
                <SafeAreaView>
                    <InputMessage 
                        token={token} 
                        idDiscussion={idDiscussion} 
                        idSession={idSession}
                    />
                </SafeAreaView>
            </SafeAreaView>
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data = {messages}
                    renderItem={({item}) => <Message pseudo={item.username} text={item.message} />}
                    keyExtractor={item => item.timePosted}
                    ItemSeparatorComponent={ItemDivider}
                />
            </SafeAreaView>
        )
    }


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 5,
        flexDirection: 'column',
        flexGrow: 1
    },

    flat: {
        margin: 50 //pour laisse la place à l'input si nécessaire 
        //TODO : à opti plus tard
    }
    
})