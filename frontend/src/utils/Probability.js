export default function checkProba(proba){

    if (proba >=0 && proba <=1) {
        return parseInt(parseFloat(proba) * 100);
    }
    else {
        alert('Les probabilités doivent comprises entre 0 et 1 !')
        return null;
    }
}