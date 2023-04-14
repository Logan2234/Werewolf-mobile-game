import { Tab, TabView } from '@rneui/base';
import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { BACKEND } from '../constants/backend';
import { textColor } from '../constants/colors';
import { InGameUserDataContext, ScreenContext, TokenContext } from '../constants/hooks';
import { commonStyles, fontSize } from '../constants/style';
import ChatView from './ChatView';
import InfoView from './InfoView';
import VoteView from './VoteView';

export default function GameView() {
    const [index, setIndex] = useState(0);
    const [donneesUser, setDonneesUser] = useState({});

    const changeView = useContext(ScreenContext);
    const token = useContext(TokenContext).token;

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
                .then(data => { console.log(data); setDonneesUser(data); })
                .catch(error => alert(error.message));
        }
        fetchUserData();
    }, [token]);

    return (
        <View style={commonStyles.container}>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{ backgroundColor: 'white', height: 3, marginBottom: 2 }}
                titleStyle={{ fontSize: fontSize, color: textColor }}
                variant="default"
                containerStyle={{ borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }}
            >
                <Tab.Item
                    title="Info"
                    icon={{ name: 'home', type: 'ionicon', color: textColor }}
                />
                <Tab.Item
                    title="Chat"
                    icon={{ name: 'chatbox-ellipses-outline', type: 'ionicon', color: textColor }}
                />
                <Tab.Item
                    title="Vote"
                    icon={{ name: 'how-to-vote', type: 'material', color: textColor }}
                />
            </Tab>
            <InGameUserDataContext.Provider value={donneesUser}>
                <TabView value={index} onChange={setIndex} animationType="spring">
                    <TabView.Item style={{ width: '100%' }}>
                        <InfoView />
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <ChatView />
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <VoteView />
                    </TabView.Item>
                </TabView>
            </InGameUserDataContext.Provider>
        </View >);
}
