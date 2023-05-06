import { useContext, useEffect, useState } from 'react';
import { BackHandler, FlatList, SafeAreaView, View } from 'react-native';
import { BACKEND } from '../constants/backend';
import { secondaryColor } from '../constants/colors';
import { CurrentGameView, TokenContext } from '../constants/hooks';
import VoteView from '../screens/VoteView';
import InputMessage from './InputMessage';
import Message from './Message';


export default function Discussion({ idDiscussion, idSession }) {
    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    const [canWrite, setWriting] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentJSX, setJSX] = useState(null);


    useEffect(() => {
        /**
         * Renvoie un booléen pour indiquer si on peut envoyer des messages
         */
        function canIWriteHere() {
            console.log(token);
            fetch(`${BACKEND}/game/${idSession}/messages/${idDiscussion}/check`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    setWriting(data.status);
                })
                .catch(error => {
                    setWriting(false);
                    console.log(error);
                });
            setWriting(true);
        }

        /**
         * Lance une requête pour récupérer l'ensemble des messages pour une discussion donnée
         */
        function getMessages() {
            fetch(`${BACKEND}/game/${idSession}/messages/${idDiscussion}`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    setMessages(data.messages);
                });
        }

        // TODO : tester avec téléphone (oupsi)
        const backActionHandler = () => {
            setJSX(<VoteView idSession={idSession} />);
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', backActionHandler);
        canIWriteHere();
        getMessages();
        return () => BackHandler.removeEventListener('hardwareBackPress', backActionHandler);

    }, [currentGameView]);
    // TODO: rafraichissement actuellement au changement de page => websocket sur les nouveaux messages


    useEffect(() => {
        /**
         *
         * @returns cute JSX Divider between messages
         */
        const ItemDivider = () => {
            return (
                <View
                    style={{
                        height: 1,
                        width: '100%',
                        backgroundColor: secondaryColor,
                        marginVertical: 5
                    }}
                />
            );
        };



        /**
         * Renvoie l'affichage
         *
         */
        if (canWrite) {
            setJSX(
                <SafeAreaView style={styles.container}>
                    <FlatList
                        style={styles.flat}
                        data={messages}
                        renderItem={({ item }) => <Message pseudo={item.username} text={item.message} />}
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
            );
        } else {
            setJSX(
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => <Message pseudo={item.username} text={item.message} />}
                        keyExtractor={item => item.timePosted}
                        ItemSeparatorComponent={ItemDivider}
                    />
                </SafeAreaView>
            );
        }
    }, [messages, currentGameView, canWrite]);

    return (currentJSX);
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

});
