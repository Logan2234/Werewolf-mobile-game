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
export default function Propose({name, votes='0', selected}) {

    console.log(name, votes);
    if (selected && votes !== '0'){
        return(
            <View style={styles.container}>
                <SizedText style={styles.pseudoSel} label={name}/>
                <SizedText label={votes}/> 
            </View>
        );
    } else if (selected && votes === '0') {
        return (
            <View style={styles.container}>
                <SizedText style={styles.pseudoSel} label={name}/>
            </View>
        );
    } else if (!selected && votes !== '0'){
        return(
            <View style={styles.container}>
                <SizedText style={styles.pseudo} label={name}/>
                <SizedText label={votes}/> 
            </View>
        );
    } else {
        return(
            <View style={styles.container}>
                <SizedText style={styles.pseudo} label={name}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        height: 40
    },

    pseudoSel: {
        fontWeight: 'bold',
        color: 'red' //TODO : meilleure couleur 
    },

    pseudoSel: {
        fontWeight: 'bold'
    },
})