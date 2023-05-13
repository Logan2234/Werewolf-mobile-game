/**
 * Liste des codes d'erreurs et leur affichage 
 */
export const errorCodes = {
    EMPTY: 'Missing information', // Eg: No data can be found in the input
    NOT_COMPLIANT: 'Invalid size', // Eg: The data does not have the correct length
    INVALID_FORMAT: 'Invalid format', // Eg: The data does not respect a certain RegExp
    NOT_EQUAL: 'Not equal', // Eg: The data is not equal to another one
    UNABLE_TO_CONNECT: 'Unable to connect', // Eg: Login details are sent but does not match
    UNABLE_TO_JOIN: 'Unable to join', // Eg: Trying to join an invalid session or game
};