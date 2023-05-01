import { View, StyleSheet } from 'react-native';
import Title from '../components/Title';
import { useEffect, useState, useContext } from 'react';
import ChoixUrne from './ChoixUrne';
import StaticUrne from './StaticUrne';
import { TokenContext, CurrentGameView } from '../constants/hooks';
import { BACKEND } from '../constants/backend';


export default function VoteView({idSession}) {
    const [voteState, setVoteState] = useState(2);
    const [voteJSX, setVoteJSX] = useState(null);

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    // TODO : Gérer le cas où la décision a déjà été prise

    useEffect (()=>{
        function setViewVote(){
            switch (voteState) {
                case 0:
                    //0:en attente de vote => Urne + boutons d'envoi/propose
                    setVoteJSX(<ChoixUrne idSession={idSession} token={token} />); break;
                case 1:
                    //1:ne peut pas/plus voter => Urne visible
                    setVoteJSX(<StaticUrne idSession={idSession} />); break;
                case 2:
                    //2:ne peut pas voir
                    setVoteJSX(<Title label='AUCUN VOTE DISPONIBLE POUR L&apos;INSTANT'/>); break;
            }
        }
    

        /**
         * TODO : Fonction qui indique si on a accès aux votes
         */
        async function canISeeVotes(){
            let canSeeVote = false;
            await fetch(`${BACKEND}/game/${idSession}/vote/check-see`, {
                method: 'GET',
                headers: { 'x-access-token': token, 
                'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == true){
                        canSeeVote = true;
                    } else {
                        canSeeVote = false;
                    }
                });
            return(canSeeVote);
        }

        /**
         * Fonction qui indique si j'ai le droit de voter
         */
        async function canIVote(){
            let canVote = false;
            await fetch(`${BACKEND}/game/${idSession}/vote/check`, {
                method: 'GET',
                headers: { 'x-access-token': token, 
                'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == true){
                        canVote = true;
                    } else {
                       canVote = false;
                    }
                });
            return(canVote);
        }

        if (canISeeVotes()===true){ //! NE PAS ENLEVER LA COMPARAISON (sinon regarde si l'appel fonctionne seulement)
            if (canIVote()===true){
                console.log("Allowed to vote");
                setVoteState(0);
            } else {
                console.log("Not allowed to vote");
                setVoteState(1);
            }
        } else {
            console.log("Not allowed to see the vote");
            setVoteState(2);
        }
        setViewVote();

    },[currentGameView])


    return (
        <View style={styles.container}>
            {voteJSX}
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
      },
    
})