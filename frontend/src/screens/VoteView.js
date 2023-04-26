import { View } from 'react-native';
import Title from '../components/Title';
import { useEffect, useState, useContext } from 'react';
import ChoixUrne from './ChoixUrne';
import { TokenContext, CurrentGameView } from '../constants/hooks';


export default function VoteView({idSession}) {
    const [voteState, setVoteState] = useState(2);
    const [voteJSX, setVoteJSX] = useState(null);

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;


    useEffect (()=>{
        function setViewVote(){
            switch (voteState) {
                case 0:
                    //0:en attente de vote => Urne + boutons d'envoi/propose
                    setVoteJSX(<ChoixUrne idSession={idSession} token={token} canVote={true}/>); break;
                case 1:
                    //1:ne peut pas/plus voter => Urne visible
                    setVoteJSX(<ChoixUrne idSession={idSession} token={token} canVote={false}/>); break;
                case 2:
                    //2:ne peut pas voir
                    setVoteJSX(<Title label='Pas de vote disponible pour le moment'/>); break;
            }
        }
    

        /**
         * TODO : Fonction qui indique si on a accès aux votes
         */
        function canISeeVotes(){
            return true;
        }

        /**
         * TODO : Fonction qui indique si j'ai le droit de voter
         */
        function canIVote(){
            return true;
        }

        if (canISeeVotes()){
            if (canIVote()){
                setVoteState(0);
            } else {
                setVoteState(1);
            }
        } else {
            setVoteState(2);
        }
        setViewVote();

    },[currentGameView])


    return (
        <View>
            {voteJSX}
        </View>);
}
