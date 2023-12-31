/**
 * 
 * @param {Date} dt_date1 
 * @param {Date} dt_date2 
 * @returns {int} L'écart (valeur absolue) entre dt_date1 et dt_date2 en ms
 */
export default function subDates(dt_date1, dt_date2) {
    return Math.abs(dt_date1.getTime() - dt_date2.getTime());
}

/**
 * 
 * @returns {Date} La date du lendemain 8h
 */
export function tomorrowDate() {
    const today = new Date();
    const tomorrowTime = today.getTime() + 24 * 3600 * 1000; // on est à J+1
    const delta = Math.abs(today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds() - 8 * 3600);
    if (today.getHours() > 8) {
        return new Date(tomorrowTime - delta * 1000);
    } else {
        return new Date(tomorrowTime + delta * 1000);
    }
}