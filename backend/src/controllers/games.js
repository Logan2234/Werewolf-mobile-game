const status = require('http-status');

const gameModel = require('../models/games.js');


const has = require('has-keys');

module.exports = {
    async createSession (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'nbMinJoueurs') || !has(JSON.parse(req.body.data), 'nbMaxJoueurs') || !has(JSON.parse(req.body.data), 'debutJour') || !has(JSON.parse(req.body.data), 'finJour') || !has(JSON.parse(req.body.data), 'probaLG') || !has(JSON.parse(req.body.data), 'probaV') || !has(JSON.parse(req.body.data), 'probaS') || !has(JSON.parse(req.body.data), 'probaI') || !has(JSON.parse(req.body.data), 'probaC')) {
            throw new CodeError('You must send all the specifications of the session', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data);
        const nbMinJoueurs = parseInt(data.nbMinJoueurs);
        const nbMaxJoueurs = parseInt(data.nbMaxJoueurs);
        const debutJour = parseInt(data.debutJour);
        const finJour = parseInt(data.finJour);
        const probaLG = parseInt(data.probaLG);
        const probaV = parseInt(data.probaV);
        const probaS = parseInt(data.probaS);
        const probaI = parseInt(data.probaI);
        const probaC = parseInt(data.probaC);

        if (isNaN(nbMinJoueurs) || isNaN(nbMaxJoueurs) || isNaN(debutJour) || isNaN(finJour) || isNaN(probaLG) || isNaN(probaV) || isNaN(probaS) || isNaN(probaI) || isNaN(probaC))
            throw new CodeError('Your specifications must be integers', status.BAD_REQUEST)

        if (nbMinJoueurs < 5)
            throw new CodeError('The minimum number of players must be at least 5', status.BAD_REQUEST)

        if (nbMaxJoueurs > 100)
            throw new CodeError('The maximum number of players must be at most 100', status.BAD_REQUEST)

        if (debutJour < 0 || debutJour > 1439)
            throw new CodeError('The beginning of the day must be between 00h00 (0) and 23h59 (1440)', status.BAD_REQUEST)

        if (finJour < 0 || finJour > 1439)
            throw new CodeError('The end of the day must be between 00h00 (0) and 23h59 (1440)', status.BAD_REQUEST)

        if (nbMinJoueurs > nbMaxJoueurs)
            throw new CodeError('The minimum number of players must be less than the maximum number of players', status.BAD_REQUEST)
        
        if (probaLG < 0 || probaLG > 100)
            throw new CodeError('The probability of a werewolf must be between 0 and 100', status.BAD_REQUEST)

        if (probaV < 0 || probaV > 100)
            throw new CodeError('The probability of a seer must be between 0 and 100', status.BAD_REQUEST)

        if (probaS < 0 || probaS > 100)
            throw new CodeError('The probability of a spiritualist must be between 0 and 100', status.BAD_REQUEST)

        if (probaI < 0 || probaI > 100)
            throw new CodeError('The probability of an insomniac must be between 0 and 100', status.BAD_REQUEST)
        
        if (probaC < 0 || probaC > 100)
            throw new CodeError('The probability of a contaminator must be between 0 and 100', status.BAD_REQUEST)

        await gameModel.create({"nbMinJoueurs": nbMinJoueurs, "nbMaxJoueurs": nbMaxJoueurs, "debutJour": debutJour, "finJour": finJour, "probaLG": probaLG, "probaV": probaV, "probaS": probaS, "probaI": probaI, "probaC": probaC});
        res.json({status: true, message: 'Session created' });
    }
}