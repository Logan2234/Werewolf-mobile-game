import { errorCodes } from '../constants/errorCode';

/** 
 * Verify a certain number of caracteristics on a given string
 * @param {string} str The string to verify
 * @param {number} minsize The minimum size of the string
 * @param {number} maxsize The maximum size of the string
 * @param {regexp} regexp The regular expression that the string must satisfy. `null` by default.
 * @return {string} The error string if any error is found
 */
export function verifyString(str, minsize, maxsize, regexp = null) {
    if (str === null || str === undefined || str.length == 0)
        return errorCodes.EMPTY;
    if (str.length < minsize || str.length > maxsize)
        return errorCodes.NOT_COMPLIANT;
    if (regexp !== null && str.search(regexp) != -1)
        return errorCodes.INVALID_FORMAT;
}


/** 
 * Verify a certain number of caracteristics on a given number
 * @param {number} number The number to verify
 * @param {number} minvalue The minimum value of the number
 * @param {number} maxvalue The maximum value of the number
 * @param {number} strSize The number of characters in the string version of the number
 * @param {regexp} regexp The regular expression that the number must satisfy. `[0-9]` by default.
 * @return {string} The error string if any error is found
 */
export function verifyNumber(number, minvalue, maxvalue, strSize = null, regexp = /[^0-9]/g) {
    if (strSize !== null && number.toString().length != strSize)
        return errorCodes.NOT_COMPLIANT;
    number = parseFloat(number);
    if (number === null || number === undefined || isNaN(number))
        return errorCodes.EMPTY;
    if (number < minvalue || number > maxvalue)
        return errorCodes.NOT_COMPLIANT;
    if (regexp !== null && number.toString().search(regexp) != -1)
        return errorCodes.INVALID_FORMAT;
}

export function verifyProba(proba) {
    if (proba >= 0 && proba <= 1)
        return parseInt(parseFloat(proba) * 100);
    return null;
}