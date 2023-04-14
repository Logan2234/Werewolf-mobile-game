import { View } from 'react-native';
import { commonStyles, fontSize } from '../constants/style';
import { Tab, TabView } from '@rneui/base';
import { createContext, useEffect, useState } from 'react';
import { textColor } from '../constants/colors';
import InfoView from './InfoView';
import ChatView from './ChatView';
import VoteView from './VoteView';
import { BACKEND } from '../constants/backend';

export const DataContext = createContext(null);

export default function GameView() {
    const [index, setIndex] = useState(0);
    const [donneesUser, setDonneesUser] = useState({});

    async function fetchData() {
        await fetch(`${BACKEND}/user/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => { setDonneesUser(data.donnees); })
            .catch(error => alert(error.message));
    }

    useEffect(() => {
        fetchData();
    }, []);

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
            <DataContext.Provider value={donneesUser}>
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
            </DataContext.Provider>
        </View >);
}
