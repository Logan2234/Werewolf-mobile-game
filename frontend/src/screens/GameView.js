import { Tab, TabView } from '@rneui/base';
import { useContext, useState } from 'react';
import { View } from 'react-native';
import { textColor } from '../constants/colors';
import { CurrentGameView, ScreenContext } from '../constants/hooks';
import { commonStyles, fontSize } from '../constants/style';
import ChatView from './ChatView';
import InfoView from './InfoView';
import PlayerView from './PlayerView';
import VoteView from './VoteView';

export default function GameView({ idSession }) {
    const [index, setIndex] = useState(0);
    const changeView = useContext(ScreenContext);

    return (
        <View style={commonStyles.container}>
            <Tab value={index}
                onChange={setIndex}
                indicatorStyle={{ backgroundColor: 'white', height: 3, marginBottom: 2 }}
                titleStyle={{ fontSize: fontSize, color: textColor }}
                variant="default"
                containerStyle={{ borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 2 }} >
                <Tab.Item
                    title="Info"
                    icon={{ name: 'home', type: 'ionicon', color: textColor }} />
                <Tab.Item
                    title="Chat"
                    icon={{ name: 'chatbox-ellipses-outline', type: 'ionicon', color: textColor }} />
                <Tab.Item
                    title="Vote"
                    icon={{ name: 'how-to-vote', type: 'material', color: textColor }} />
                <Tab.Item
                    title="Joueurs"
                    icon={{ name: 'people', type: 'ionicon', color: textColor }} />
            </Tab>
            <CurrentGameView.Provider value={index}>
                <TabView value={index} onChange={setIndex} animationType="spring">
                    <TabView.Item style={{ width: '100%' }}>
                        <InfoView idSession={idSession} />
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <ChatView idGame={idSession}  />
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <VoteView />
                    </TabView.Item>
                    <TabView.Item style={{ width: '100%' }}>
                        <PlayerView idSession={idSession} />
                    </TabView.Item>
                </TabView>
            </CurrentGameView.Provider>
        </View >);
}
