import { View } from 'react-native';
import Title from '../components/Title';
import DiscussionVillage from './DiscussionVillage';
import { useContext } from 'react';
import { TokenContext } from '../constants/hooks';


// TODO : trouver comment envoyer token proprement
// TODO : gérer les différentes discussions accessibles

export default function ChatView() {
    const token = useContext(TokenContext).token;

    return (
            <DiscussionVillage token={token}/>
        );
}
