//Eligible.js

import { View, StyleSheet } from "react-native";
import SizedText from "./SizedText";
import { useState } from "react";

/**
 * TODO : tester affichage de une personne
 * @param {string} name 
 * @param {int} votes
 * @param {boolean} selected
 * @returns Personne (objet JSX) qui a été proposée au vote avec son nombre de vote associé
 * et de couleur différente si sélectionnée
 */
export default function Propose({name, votes=0, selected}) {

    return(
        <View style={StyleSheet.container}>
            {
                (selected)
                ?<SizedText style={styles.pseudoSel} label={name}/>
                :<SizedText style={styles.pseudo} label={name}/>
            }
            {
                (votes === 0)
                ? <></>
                : <SizedText label={votes}/>   
            }             
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },

    pseudoSel: {
        fontWeight: 'bold',
        color: 'red' //TODO : meilleure couleur 
    },

    pseudoSel: {
        fontWeight: 'bold'
    },
})