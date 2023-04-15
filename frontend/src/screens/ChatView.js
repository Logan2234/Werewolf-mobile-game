import { View } from 'react-native';
import Title from '../components/Title';
import DiscussionVillage from './DiscussionVillage';
import { useContext } from 'react';
import { TokenContext } from '../constants/hooks';

// TODO : gérer les différentes discussions accessibles
export default function ChatView({idGame}) {
    const token = useContext(TokenContext).token;

    return (
            <DiscussionVillage token={token} idGame={idGame} />
        );
}
