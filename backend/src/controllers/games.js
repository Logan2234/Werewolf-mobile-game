const status = require('http-status');

const gameModel = require('../models/games.js');
const userModel = require('../models/users.js');
const inGameModel = require('../models/inGames.js');
const usersInQModel = require('../models/usersInQs.js');
const lieuModel = require('../models/lieux.js');
const CodeError = require('../util/CodeError.js')

const has = require('has-keys');

var timers = {}

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

        if (isNaN(nbMinJoueurs) || isNaN(nbMaxJoueurs) || isNaN(dureeJour) || isNaN(dureeNuit) || isNaN(probaLG) || isNaN(probaV) || isNaN(probaS) || isNaN(probaI) || isNaN(probaC) || isNaN(debutPartie))
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

        let idGame = Math.trunc(Math.random()*1000000)

        while (true){
            const game = await gameModel.findOne({where: {"id": idGame}})
            const inGame = await inGameModel.findOne({where: {"id": idGame}})
            if (game == null && inGame == null)
                break
            idGame = Math.trunc(Math.random()*1000000)
        }

        const gameData = await gameModel.create({"id": idGame, "nbMinJoueurs": nbMinJoueurs, "nbMaxJoueurs": nbMaxJoueurs, "dureeJour": dureeJour, "dureeNuit": dureeNuit, "probaLG": probaLG, "probaV": probaV, "probaS": probaS, "probaI": probaI, "probaC": probaC, "debutPartie": debutPartie});
        
        //timers[idGame] = setTimeout(createGame, 60000 * debutPartie, idGame)

        idGame = "0".repeat(6 - idGame.toString().length) + idGame.toString()  // On renvoit l'id sous forme de string de 6 caractères
        res.json({status: true, message: 'Session created', idGame})
    },

    async joinSession (req, res){
        const username = req.login
        const data = await userModel.findOne({where: {username}})
        const userId = parseInt(data.id)
        let {idSession} = req.params
        idSession = parseInt(idSession)
        await usersInQModel.create({"idUser": userId, "idGame": idSession})
        const session = await gameModel.findOne({where: {"id": idSession}})
        const users = await usersInQModel.findAll({where: {"idGame": idSession}})
        const nbUsers = users.length
        if (nbUsers >= session.nbMaxJoueurs) {
            createGame(idSession)
            res.json({status: true, message: 'Session joined and game started' })
            return
        }
        res.json({status: true, message: 'Session joined' })
    },
    
    async getSessionParam (req, res){
        if (!has(req.params, 'idSession')) throw new CodeError('You must specify the id of the session', status.BAD_REQUEST)
        let {idSession} = req.params
        idSession = parseInt(idSession)
        const session = await gameModel.findOne({where: {"id": idSession}})
        res.json({status: true, message: 'Session found', session})
    },

    async createGame (idSession) {
        const session = await gameModel.findOne({where: {"id": idSession}})
        const users = await usersInQModel.findAll({where: {"idGame": idSession}})
        const nbUsers = users.length
        const nbMinJoueurs = session.nbMinJoueurs

        // Si on a assez de joeurs, on crée la partie
        if (nbUsers >= nbMinJoueurs) {
            const dureeJour = session.dureeJour
            const dureeNuit = session.dureeNuit
            const probaLG = session.probaLG
            const probaV = session.probaV
            const probaS = session.probaS
            const probaI = session.probaI
            const probaC = session.probaC
            const nbLG = Math.floor(nbUsers * probaLG / 100)
            let isThereAV = false
            let isThereAS = false
            let isThereAI = false
            let isThereAC = false
            let random = Math.trunc(Math.random() * 100)
            if (random < probaV) {isThereAV = true} 
            random = Math.trunc(Math.random() * 100)
            if (random < probaS) {isThereAS = true}
            random = Math.trunc(Math.random() * 100)
            if (random < probaI) {isThereAI = true}
            random = Math.trunc(Math.random() * 100)
            if (random < probaC) {isThereAC = true}
            users.sort(() => Math.random() - 0.5); // On mélange les joueurs
            for (let i = 0; i < nbLG; i++) {
                await usersInQModel.create({"idUser": users[i].idUser, "idGame": idSession, "role": "LG"})
            }
            let indicateur = nbLG
            if (isThereAV) {
                await usersInQModel.create({"idUser": users[indicateur].idUser, "idGame": idSession, "role": "V"})
                indicateur++
            }
            if (isThereAS) {
                await usersInQModel.create({"idUser": users[indicateur].idUser, "idGame": idSession, "role": "S"})
                indicateur++
            }
            if (isThereAI) {
                await usersInQModel.create({"idUser": users[indicateur].idUser, "idGame": idSession, "role": "I"})
                indicateur++
            }
            if (isThereAC) {
                await usersInQModel.create({"idUser": users[indicateur].idUser, "idGame": idSession, "role": "C"})
                indicateur++
            }
            for (let i = indicateur; i < nbUsers; i++) {
                await usersInQModel.create({"idUser": users[i].idUser, "idGame": idSession, "role": "VI"})
            }
            await inGameModel.create({"id": idSession, "nbJoueurs": nbUsers, "dureeJour": dureeJour, "dureeNuit": dureeNuit, "nbLG": nbLG, "probaV": probaV, "probaS": probaS, "probaI": probaI, "probaC": probaC, "moment": "N"})
            await lieuModel.create({"idPartie": idSession, "typeLieu": "P"})
            await lieuModel.create({"idPartie": idSession, "typeLieu": "R"})
            await lieuModel.create({"idPartie": idSession, "typeLieu": "E"})
        }

        // Indépendament de si la partie a été créée ou pas, on supprime la session de la queue.
        await gameModel.destroy({where: {"id": idSession}})
        await usersInQModel.destroy({where: {"idGame": idSession}})
    },

    async getUsersSession (req, res) {
        let {idSession} = req.params
        idSession = parseInt(idSession)
        const users = await usersInQModel.findAll({where: {"idGame": idSession}, attributes: ['idUser']})
        let usersList = []
        for (let i = 0; i < users.length; i++) {
            const user = await userModel.findOne({where: {"id": users[i].idUser}, attributes: ['username']})
            usersList.push(user.username)
        }
        res.json({status: true, message: 'Users of session ' + idSession.toString(), usersList})
    },

    async returnTimeLeft(req, res) {
        let {idSession} = req.params
        if (await gameModel.findOne({where: {"id": idSession}})) {
            let timeLeft = getTimeLeft(timers[idSession])
            res.json({status: true, message: 'Time left in seconds' + idSession.toString(), usersList})
            return
        }

        if (await inGameModel.findOne({where: {"id": idSession}}))
            throw new CodeError('Game has started already !', status.BAD_REQUEST)

        throw new CodeError("Game doesn't exist", status.BAD_REQUEST)
    }

    
}

function getTimeLeft(timeout) {
    return Math.ceil((timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000);
}