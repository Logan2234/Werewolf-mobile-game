import { useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import Bouton from '../components/Bouton';
import Propose from '../components/Propose';
import Title from '../components/Title';
import { BACKEND } from '../constants/backend';
import { CurrentGameView, TokenContext } from '../constants/hooks';
import { commonStyles } from '../constants/style';

/**
 * Affichage pour que le spiritiste puisse choisir avec quel mort parler pendant la nuit
 *
 * @param {int} idSession
 * @returns
 */
export default function ChoixSpiritisme({ idSession }) {
    const [proposes, setProposes] = useState([]); //liste des sélectionnables
    const [selectedUser, setSelectedUser] = useState(null); //utilisateur sélectionné
    const [utilise, setUtilise] = useState(false); //précédent usage du pouvoir pendant la nuit
    const [currentJSX, setJSX] = useState(null); //affichage

    const currentGameView = useContext(CurrentGameView);
    const token = useContext(TokenContext).token;

    useEffect(() => {
        /**
         * Requête qui renvoie la liste des joueurs morts
         * Pour set proposes
         */
        function fetchDeads() {
            fetch(`${BACKEND}/game/${idSession}/deads`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => setProposes(data.deadUsers))
                .catch(error => alert(error.message));
        }

        /**
         * TODO : Requete qui vérifie si le pouvoir a déjà été utilisé
         * Pour set utilise
         */
        function fetchUsage() {
            fetch(`${BACKEND}/game/${idSession}/actions/check`, {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => setUtilise(data.status));
        }

        fetchUsage();
        fetchDeads();

    }, [currentGameView, idSession, token]);

    useEffect(() => {
        /**
         * Requête qui va sélectionner un joueur pour parler la nuit
         * (action lorsque l'on valide le choix du joueur)
         */
        function discute() {
            if (selectedUser !== null) {
                fetch(`${BACKEND}/game/${idSession}/actions/spiritism`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: '"victime": "' + selectedUser + '"}' })
                })
                    .then(response => response.json())
                    .catch(error => alert(error.message));
            } else {
                alert('Merci de choisir un mort à qui parler.');
            }
        }


        if (utilise === false) {

            if (proposes.length > 0) {
                const renderItem = ({ item }) => {
                    return (
                        <Pressable onPress={() => setSelectedUser(item)} >
                            <Propose
                                name={item}
                                selected={item === selectedUser}
                            />
                        </Pressable>
                    );
                };

                setJSX(
                    <SafeAreaView style={styles.container}>
                        <Title label='Parler à un joueur mort' />
                        <FlatList
                            data={proposes}
                            keyExtractor={item => item}
                            renderItem={renderItem}
                        />
                        <SafeAreaView style={[commonStyles.bottom, styles.bottom]} >
                            <Bouton label='Sélectionner' onPress={discute} />
                        </SafeAreaView>
                    </SafeAreaView>
                );
            } else {
                setJSX(
                    <Title label='Aucun mort pour le moment' />
                );
            }
        } else {
            setJSX(
                <Title label='POUVOIR DEJA UTILISE' />
            );
        }
    }, [selectedUser, currentGameView, proposes, utilise, idSession, token]);

    return (currentJSX);
}

const styles = StyleSheet.create({
    bottom: {
        flexDirection: 'column',
        margin: 2,
        gap: 10
    },

    container: {
        paddingTop: 5,
        flex: 1,
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-around'
    }

});