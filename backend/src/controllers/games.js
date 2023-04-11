const status = require('http-status');

const gameModel = require('../models/games.js');
const userModel = require('../models/users.js');
const usersInQModel = require('../models/usersInQs.js');
const CodeError = require('../util/CodeError.js')

const has = require('has-keys');

module.exports = {
    async createSession (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'nbMinJoueurs') || !has(JSON.parse(req.body.data), 'nbMaxJoueurs') || !has(JSON.parse(req.body.data), 'dureeJour') || !has(JSON.parse(req.body.data), 'dureeNuit') || !has(JSON.parse(req.body.data), 'probaLG') || !has(JSON.parse(req.body.data), 'probaV') || !has(JSON.parse(req.body.data), 'probaS') || !has(JSON.parse(req.body.data), 'probaI') || !has(JSON.parse(req.body.data), 'probaC') || !has(JSON.parse(req.body.data), 'debutPartie')) {
            throw new CodeError('You must send all the specifications of the session', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data);
        const nbMinJoueurs = parseInt(data.nbMinJoueurs);
        const nbMaxJoueurs = parseInt(data.nbMaxJoueurs);
        const dureeJour = parseInt(data.dureeJour);
        const dureeNuit = parseInt(data.dureeNuit);
        const probaLG = parseInt(data.probaLG);
        const probaV = parseInt(data.probaV);
        const probaS = parseInt(data.probaS);
        const probaI = parseInt(data.probaI);
        const probaC = parseInt(data.probaC);
        const debutPartie = parseInt(data.debutPartie);

        if (isNaN(nbMinJoueurs) || isNaN(nbMaxJoueurs) || isNaN(debutJour) || isNaN(finJour) || isNaN(probaLG) || isNaN(probaV) || isNaN(probaS) || isNaN(probaI) || isNaN(probaC) || isNaN(debutPartie))
            throw new CodeError('Your specifications must be integers', status.BAD_REQUEST)

        if (nbMinJoueurs < 5)
            throw new CodeError('The minimum number of players must be at least 5', status.BAD_REQUEST)

        if (nbMaxJoueurs > 100)
            throw new CodeError('The maximum number of players must be at most 100', status.BAD_REQUEST)

        if (dureeJour < 0)
            throw new CodeError('The time of a day must be higher than 0 minutes', status.BAD_REQUEST)

        if (dureeNuit < 0)
            throw new CodeError('The time of a night must be higher than 0 minutes', status.BAD_REQUEST)

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
        
        if (debutPartie < 0)
            throw new CodeError('The time of the beginning of the game must be higher than 0 minutes', status.BAD_REQUEST)

        const gameData = await gameModel.create({"nbMinJoueurs": nbMinJoueurs, "nbMaxJoueurs": nbMaxJoueurs, "dureeJour": dureeJour, "dureeNuit": dureeNuit, "probaLG": probaLG, "probaV": probaV, "probaS": probaS, "probaI": probaI, "probaC": probaC});
        
        const idGame = gameData.id
        res.json({status: true, message: 'Session created', idGame});
    },

    async joinSession (req, res){
        const username = req.login
        const data = await userModel.findOne({where: {username}})
        const userId = parseInt(data.id)
        let {idSession} = req.params
        idSession = parseInt(idSession)
        console.log(idSession)
        console.log(data)
        console.log(username)
        await usersInQModel.create({"idUser": userId, "idGame": idSession})
        res.json({status: true, message: 'Session joined' })
    },
    
    async getSessionParam (req, res){
        if (!has(req.params, 'idSession')) throw new CodeError('You must specify the id of the session', status.BAD_REQUEST)
        let {idSession} = req.params
        idSession = parseInt(idSession)
        const session = await gameModel.findOne({where: {"id": idSession}})
        res.json({status: true, message: 'Session found', session})
    },

    async destroySession (req, res){
        if (!has(req.params, 'idSession')) throw new CodeError('You must specify the id of the session', status.BAD_REQUEST)
        let {idSession} = req.params
        idSession = parseInt(idSession)
        await gameModel.destroy({where: {"id": idSession}})
        await usersInQModel.destroy({where: {"idGame": idSession}})
        res.json({status: true, message: 'Session destroyed' })
    }
}