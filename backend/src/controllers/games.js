const status = require('http-status');

const gameModel = require('../models/games.js');
const userModel = require('../models/user.js');


const has = require('has-keys');

module.exports = {
    async createSession (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'nbMinJoueurs') || !has(JSON.parse(req.body.data), 'nbMaxJoueurs') || !has(JSON.parse(req.body.data), 'debutJour') || !has(JSON.parse(req.body.data), 'finJour') || !has(JSON.parse(req.body.data), 'probaLG') || !has(JSON.parse(req.body.data), 'probaV') || !has(JSON.parse(req.body.data), 'probaS') || !has(JSON.parse(req.body.data), 'probaI') || !has(JSON.parse(req.body.data), 'probaC')) {
            throw new CodeError('You must send all the specifications of the session', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data);
        const nbMinJoueurs = data.nbMinJoueurs;
        const nbMaxJoueurs = data.nbMaxJoueurs;
        const debutJour = data.debutJour;
        const finJour = data.finJour;
        const probaLG = data.probaLG;
        const probaV = data.probaV;
        const probaS = data.probaS;
        const probaI = data.probaI;
        const probaC = data.probaC;

        
        
    }
}