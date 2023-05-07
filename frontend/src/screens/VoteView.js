import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { CurrentGameView, TokenContext } from '../constants/hooks';
import { gameViews } from '../constants/screens';
import ChoixUrne from './ChoixUrne';
import StaticUrne from './StaticUrne';


export default function VoteView({ idSession }) {
    const [voteState, setVoteState] = useState(2);
    const [voteJSX, setVoteJSX] = useState(null);

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    // TODO : Gérer le cas où la décision a déjà été prise

    useEffect(() => {
        /**
         * TODO : Fonction qui indique si on a accès aux votes
         */
        function canISeeVotes() {
            let canSeeVote = false;
            fetch(`${BACKEND}/game/${idSession}/vote/check-see`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => canSeeVote = data.status);
            return canSeeVote;
        }

        /**
         * Fonction qui indique si j'ai le droit de voter
         */
        function canIVote() {
            let canVote = false;
            fetch(`${BACKEND}/game/${idSession}/vote/check`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => canVote = data.status);
            return canVote;
        }

        if (currentGameView == gameViews.VOTE) {
            if (canISeeVotes() === true) { //! NE PAS ENLEVER LA COMPARAISON (sinon regarde si l'appel fonctionne seulement)
                if (canIVote() === true) {
                    console.log('Allowed to vote');
                    setVoteState(0);
                } else {
                    console.log('Not allowed to vote');
                    setVoteState(1);
                }
            } else {
                console.log('Not allowed to see the vote');
                setVoteState(2);
            }
        }

    }, [currentGameView, idSession, token]);

    useEffect(() => {
        switch (voteState) {
            case 0:
                // 0: en attente de vote => Urne + boutons d'envoi/propose
                setVoteJSX(<ChoixUrne idSession={idSession} token={token} />); break;
            case 1:
                // 1: ne peut pas/plus voter => Urne visible
                setVoteJSX(<StaticUrne idSession={idSession} />); break;
            case 2:
                // 2:ne peut pas voir
                setVoteJSX(<Title label='AUCUN VOTE DISPONIBLE POUR L&apos;INSTANT' />); break;
        }
    }, [idSession, token, voteState]);

    return (
        <View style={styles.container}>{voteJSX}</View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
});
