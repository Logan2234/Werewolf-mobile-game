import { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { BACKEND, WEBSOCKET } from '../constants/backend';
import { secondaryColor } from '../constants/colors';
import { TokenContext } from '../constants/hooks';
import { commonStyles } from '../constants/style';
import InputMessage from './InputMessage';
import Message from './Message';
import Title from './Title';

export default function Discussion({ title, idDiscussion, idSession }) {
    const token = useContext(TokenContext).token;

    const [canWrite, setWriting] = useState(false);
    const [messages, setMessages] = useState([]);
    const [reference, setReference] = useState(null);

    const ws = useRef(new WebSocket(WEBSOCKET)).current;

    useEffect(() => {
        ws.onerror = (e) => {
            console.log(e);
        };
        ws.onmessage = (e) => {
            let data = JSON.parse(e.data);
            console.log(data);
            if (parseInt(data.idSession) == idSession && data.idDiscussion == idDiscussion)
                setMessages(messages => [...messages, { username: data.username, message: data.message, timePosted: new Date() }]);
            // let newUser = (JSON.parse(e.data).idSession == idSession.toString()) ? JSON.parse(e.data).player : null;
            // if (newUser != null && !users.includes(newUser))
        };
    }, []);

    useEffect(() => {
        /**
         * Renvoie un booléen pour indiquer si on peut envoyer des messages
         */
        function canIWriteHere() {
            fetch(`${BACKEND}/game/${idSession}/messages/${idDiscussion}/check`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => setWriting(data.status))
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
                .then(data => setMessages(data.messages))
                .catch(error => alert(error.message));
        }

        // TODO : backhandler
        // const backActionHandler = () => {
        //     setJSX(<VoteView idSession={idSession} />);
        //     return true;
        // };
        // BackHandler.addEventListener('hardwareBackPress', backActionHandler);
        canIWriteHere();
        getMessages();
        // return () => BackHandler.removeEventListener('hardwareBackPress', backActionHandler);
    }, [token, idSession, idDiscussion]);
    // TODO: rafraichissement actuellement au changement de page => websocket sur les nouveaux messages

    /**
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

    useEffect(() => {
        if (reference != null && messages.length != 0)
            reference.scrollToEnd({ animated: false });
    }, [reference, messages]);

    return (
        <View style={[commonStyles.container, styles.container]}>
            <Title label={title} style={{ marginTop: 0 }} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flatlist_container}>
                <FlatList
                    ref={ref => setReference(ref)}
                    data={messages}
                    renderItem={({ item }) => <Message pseudo={item.username} text={item.message} />}
                    keyExtractor={item => item.timePosted}
                    ItemSeparatorComponent={ItemDivider}
                />
            </KeyboardAvoidingView>
            {
                (canWrite)
                    ? <InputMessage idDiscussion={idDiscussion} idSession={idSession} ws={ws} />
                    : null
            }
        </View>);
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },

    flatlist_container: {
        height: '78%'
    }
});
