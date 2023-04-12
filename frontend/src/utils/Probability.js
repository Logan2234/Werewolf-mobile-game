export default function checkProba(proba) {
    if (proba >= 0 && proba <= 1) {
        return parseInt(parseFloat(proba) * 100);
    }
    return null;
}