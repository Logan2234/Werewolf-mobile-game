import { errorCodes } from '../constants/errorCode';

export function verifyString(str, minsize, maxsize) {
    if (str === null || str === undefined || str.length == 0)
        return errorCodes.EMPTY;
    if (str.length < minsize || str.length > maxsize)
        return errorCodes.NOT_COMPLIANT;
    // TODO errorCodes.INVALID_FORMAT
}

export function verifyPassword(password, minsize, maxsize) {
    if (password === null || password === undefined || password.length == 0)
        return errorCodes.EMPTY;
    if (password.length < minsize || password.length > maxsize)
        return errorCodes.NOT_COMPLIANT;
    // TODO errorCodes.INVALID_FORMAT
}

export function verifyNumber(number, minvalue, maxvalue, strSize = null) {
    number = parseFloat(number);
    if (number === null || number === undefined || isNaN(number))
        return errorCodes.EMPTY;
    if (number < minvalue || number > maxvalue)
        return errorCodes.NOT_COMPLIANT;
    if (strSize !== null && number.toString().length != strSize)
        return errorCodes.NOT_COMPLIANT;
    // TODO errorCodes.INVALID_FORMAT
}