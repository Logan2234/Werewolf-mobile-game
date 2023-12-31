import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { primaryColor } from '../constants/colors';
import { CurrentGameView, TokenContext } from '../constants/hooks';
import { gameViews } from '../constants/screens';
import ChoixUrne from './ChoixUrne';
import StaticUrne from './StaticUrne';

/**
 * Vue qui gère les votes et les affichages appropriés en fonction de l'état des votes et des droits du joueur
 *
 * @param {int} idSession
 * @returns
 */
export default function VoteView({ idSession }) {
    const [voteState, setVoteState] = useState(2);
    const [voteJSX, setVoteJSX] = useState(null);
    const [canShow, setCanShow] = useState(false);

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    // TODO : Gérer le cas où la décision a déjà été prise

    useEffect(() => {
        /**
         * Fonction qui indique si on a accès aux votes
         */
        function canISeeVotes() {
            fetch(`${BACKEND}/game/${idSession}/vote/check-see`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => (data.status) ? canIVote() : setVoteState(2))
                .then(() => setCanShow(true))
                .catch(error => alert(error.message));
        }

        /**
     * Fonction qui indique si j'ai le droit de voter
     */
        function canIVote() {
            fetch(`${BACKEND}/game/${idSession}/vote/check`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => (data.status) ? setVoteState(0) : setVoteState(1))
                .catch(error => alert(error.message));
        }

        if (currentGameView == gameViews.VOTE) {
            setCanShow(false);
            canISeeVotes();
        }
    }, [currentGameView, idSession, token]);

    useEffect(() => {
        switch (voteState) {
            case 0:
                // 0: en attente de vote => Urne + boutons d'envoi/propose
                setVoteJSX(<ChoixUrne idSession={idSession} />); break;
            case 1:
                // 1: ne peut pas/plus voter => Urne visible
                setVoteJSX(<StaticUrne idSession={idSession} />); break;
            case 2:
                // 2: ne peut pas voir
                setVoteJSX(<Title label='Aucun vote disponible pour le moment' />); break;
        }
    }, [idSession, token, voteState]);

    return (
        <>
            {
                (canShow)
                    ? <View style={styles.container}>{voteJSX}</View>
                    : <ActivityIndicator style={{ height: '100%' }} size={100} color={primaryColor} />
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
});
