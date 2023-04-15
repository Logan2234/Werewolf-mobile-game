const status = require('http-status');

const gameModel = require('../models/games.js')
const userModel = require('../models/users.js')
const inGameModel = require('../models/inGames.js')
const usersInQModel = require('../models/usersInQs.js')
const lieuModel = require('../models/lieus.js')
const messageModel = require('../models/messages.js')
const urneModel = require('../models/urnes.js')
const salleEspiritismeModel = require('../models/salleEspiritisme.js')
const CodeError = require('../util/CodeError.js')

const has = require('has-keys');
const usersInGames = require('../models/usersInGames.js');

var timers = {}

module.exports = {
    async startNight(idGame) {
        await inGameModel.update({"moment": "N"}, {where: {"id": idGame}})
        const currentUrne = await urneModel.findOne({where: {"id": idGame}})
        // Hurne
    },

    async getMessagesFromPlace (req, res) {
        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        const idLieu = (await lieuModel.findOne({where: {"idPartie": idGame, "typeLieu": "P"}})).idLieu
        if (userInGame.vie == "M") {
            const messages = await messageModel.findAll({where: {"idLieu": idLieu}, attributes: ['username', 'message', 'timePosted']})
            res.json({status: true, message: 'Messages of the Central Place from the beginning', messages})
            return
        } else {
            const session = await inGameModel.findOne({where: {"id": idGame}})
            if (session.moment != "J") throw new CodeError('You can\'t see the messages of the Central Place during the night', status.FORBIDDEN)
            const messages = await messageModel.findAll({where: {"idLieu": idLieu, "archive": false}, attributes: ['username', 'message', 'timePosted']})
            res.json({status: true, message: 'Messages of the Central Place', messages})
            return
        }
    },

    async getMessagesFromRepere (req, res) {
        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        const idLieu = (await lieuModel.findOne({where: {"idPartie": idGame, "typeLieu": "R"}})).idLieu
        if (userInGame.vie == "M") {
            const messages = await messageModel.findAll({where: {"idLieu": idLieu}, attributes: ['username', 'message', 'timePosted']})
            res.json({status: true, message: 'Messages of the lair of werewolves from the beginning', messages})
            return
        } else {
            if (userInGame.role == "LG" || userInGame.pouvoir == "I") {
                const session = await inGameModel.findOne({where: {"id": idGame}})
                if (session.moment != "N") throw new CodeError('You can\'t see the messages of the lair of werewolves during the day', status.FORBIDDEN)
                const messages = await messageModel.findAll({where: {"idLieu": idLieu, "archive": false}, attributes: ['username', 'message', 'timePosted']})
                res.json({status: true, message: 'Messages of the lair of werewolves', messages})
                return
            } else {
                throw new CodeError(username + ' have no access to the messages of the lair of werewolves', status.FORBIDDEN)
            }
        }
    },

    async getMessagesFromSpiritismRoom (req, res) {
        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        const Lieu = await lieuModel.findOne({where: {"idPartie": idGame, "typeLieu": "E"}})
        if (!Lieu) throw new CodeError('No spiritism room in game ' + idGame, status.NOT_FOUND)
        const idLieu = Lieu.idLieu

        if (userInGame.vie == "M") {
            const messages = await messageModel.findAll({where: {"idLieu": idLieu}, attributes: ['username', 'message', 'timePosted']})
            res.json({status: true, message: 'Messages of the spiritist room from the beginning', messages})
            return
        } else {
            if (userInGame.pouvoir == "S") {
                const session = await inGameModel.findOne({where: {"id": idGame}})
                if (session.moment != "N") throw new CodeError('You can\'t see the messages of the spiritism room during the day', status.FORBIDDEN)
                const messages = await messageModel.findAll({where: {"idLieu": idLieu, "archive": false}, attributes: ['username', 'message', 'timePosted']})
                res.json({status: true, message: 'Messages of the spiritism room', messages})
                return
            } else {
                throw new CodeError(username + ' have no access to the messages of the spiritism room', status.FORBIDDEN)
            }
        }
    },

    async sendMessageToPlace (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'message')) {
            throw new CodeError('You have not specified a message !', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data)
        const message = data.message

        if (message == "") {
            throw new CodeError('Your message can\'t be empty', status.BAD_REQUEST)
        }

        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        const idLieu = (await lieuModel.findOne({where: {"idPartie": idGame, "typeLieu": "P"}})).idLieu

        if (userInGame.vie == "M") {
            throw new CodeError(username + ' is dead in game ' + idGame, status.FORBIDDEN)
        } else {
            const session = await inGameModel.findOne({where: {"id": parseInt(idGame)}})
            if (session.moment != "J") throw new CodeError('You can\'t send messages to the Central Place during the night', status.FORBIDDEN)
            await messageModel.create({"idLieu": idLieu, "username": username, "message": message, "archive": false})
            res.json({status: true, message: 'Message sent'})
            return
        }
    },

    async sendMessageToRepere (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'message')) {
            throw new CodeError('You have not specified a message !', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data)
        const message = data.message

        if (message == "") {
            throw new CodeError('Your message can\'t be empty', status.BAD_REQUEST)
        }

        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        const idLieu = (await lieuModel.findOne({where: {"idPartie": idGame, "typeLieu": "R"}})).idLieu

        if (userInGame.vie == "M") {
            throw new CodeError(username + ' is dead in game ' + idGame, status.FORBIDDEN)
        } else {
            if (userInGame.role == "LG") {
                const session = await inGameModel.findOne({where: {"id": parseInt(idGame)}})
                if (session.moment != "N") throw new CodeError('You can\'t send messages to the lair of werewolves during the day', status.FORBIDDEN)
                await messageModel.create({"idLieu": idLieu, "username": username, "message": message, "archive": false})
                res.json({status: true, message: 'Message sent'})
                return
            } else {
                throw new CodeError(username + ' can\'t messages to the lair of werewolves', status.FORBIDDEN)
            }
        }
    },

    async sendMessageToSpiritismRoom (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'message')) {
            throw new CodeError('You have not specified a message !', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data)
        const message = data.message

        if (message == "") {
            throw new CodeError('Your message can\'t be empty', status.BAD_REQUEST)
        }

        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        const idLieu = (await lieuModel.findOne({where: {"idPartie": idGame, "typeLieu": "E"}})).idLieu

        const victime = await salleEspiritismeModel.findOne({where: {"victime": username}})
        if (userInGame.vie == "M" && !victime) {
            throw new CodeError(username + ' is dead in game ' + idGame, status.FORBIDDEN)
        } else {
            if (userInGame.pouvoir == "S" || (userInGame.vie == "M" && victime != null)) {
                const session = await inGameModel.findOne({where: {"id": idGame}})
                if (session.moment != "N") throw new CodeError('You can\'t send messages to the spiritism room during the day', status.FORBIDDEN)
                await messageModel.create({"idLieu": idLieu, "username": username, "message": message, "archive": false})
                res.json({status: true, message: 'Message sent'})
                return
            } else {
                throw new CodeError(username + ' can\'t messages to the spiritism room', status.FORBIDDEN)
            }
        }
    },

    async getAliveUsers (req, res) {
        let {idGame} = req.params
        const users = await usersInGames.findAll({where: {"idGame": parseInt(idGame), "vie": "V"}, attributes: ['idUser']})
        var aliveUsers = []
        let aux = ""
        for (let i = 0; i < users.length; i++) {
            aux = (await userModel.findOne({where: {"id": users[i].idUser}})).username
            aliveUsers.push(aux)
        }
        res.json({status: true, message: 'List of alive users', aliveUsers})
    },

    async getDeadUsers (req, res) {
        let {idGame} = req.params
        const users = await usersInGames.findAll({where: {"idGame": parseInt(idGame), "vie": "M"}, attributes: ['idUser']})
        var deadUsers = []
        let aux = ""
        for (let i = 0; i < users.length; i++) {
            aux = (await userModel.findOne({where: {"id": users[i].idUser}})).username
            deadUsers.push(aux)
        }
        res.json({status: true, message: 'List of dead users', deadUsers})
    },

    async selectAVictimForSpiritism (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'victime')) {
            throw new CodeError('You have not specified a message !', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data)

        const username = req.login
        let idSpiritist = (await userModel.findOne({where: {"username": username}})).id
        const spiritistInGame = await usersInGames.findOne({where: {"idUser": idSpiritist}})
        if (spiritistInGame == null) {
            throw new CodeError('You are not in a game', status.BAD_REQUEST)
        }
        if (spiritistInGame.pouvoir != "S") {
            throw new CodeError('You are not a spiritist', status.BAD_REQUEST)
        }

        const victime = data.victime
        const idVictime = await userModel.findOne({where: {"username": victime}})
        if (idVictime == null) {
            throw new CodeError('This user does not exist', status.BAD_REQUEST)
        }
        const userInTheGame = await usersInGames.findOne({where: {"idUser": idVictime.id}})
        if (userInTheGame == null) {
            throw new CodeError('This user is not in a game', status.BAD_REQUEST)
        }
        if (userInTheGame.vie != "M") {
            throw new CodeError('You cannot use spiritism with alive people', status.BAD_REQUEST)
        }

        let {idGame} = req.params

        const salleEspiritisme = await salleEspiritismeModel.findOne({where: {"idGame": idGame}})
        if (salleEspiritisme == null) {
            await salleEspiritismeModel.create({"idGame": idGame, "espiritiste": username, "victime": victime})
            await usersInGames.update({"pouvoirUtilise": true}, {where: {"idUser": idSpiritist}})
            res.json({status: true, message: 'Victim selected'})
            return
        } else {
            if (userInTheGame.pouvoirUtilise) {
                throw new CodeError('The victim has already been changed', status.FORBIDDEN)
            } else {
                await salleEspiritismeModel.update({"victime": victime}, {where: {"idGame": idGame}})
                await usersInGames.update({"pouvoirUtilise": true}, {where: {"idUser": idSpiritist}})
                res.json({status: true, message: 'Victim selected'})
                return
            }
        }
    },

    async selectAVictimForContaminator (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'victime')) {
            throw new CodeError('You have not specified a message !', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data)
        const victime = data.victime
        const username = req.login
        let idContaminator = (await userModel.findOne({where: {"username": username}})).id
        const contaminatorInGame = await usersInGames.findOne({where: {"idUser": idContaminator}})
        if (contaminatorInGame == null) {
            throw new CodeError('You are not in a game', status.BAD_REQUEST)
        }
        if (contaminatorInGame.pouvoir != "C") {
            throw new CodeError('You are not a contaminator', status.BAD_REQUEST)
        }
        if (contaminatorInGame.pouvoirUtilise) {
            throw new CodeError('You have already used your power for today', status.FORBIDDEN)
        }

        let {idGame} = req.params

        const game = await inGameModel.findOne({where: {"id": idGame}})
        if (game == null) {
            throw new CodeError('This game does not exist', status.BAD_REQUEST)
        }
        if (game.moment != "N") {
            throw new CodeError('You can\'t use your power during the day', status.FORBIDDEN)
        }

        const idVictime = await userModel.findOne({where: {"username": victime}})
        if (idVictime == null) {
            throw new CodeError('This user does not exist', status.BAD_REQUEST)
        }
        const userInTheGame = await usersInGames.findOne({where: {"idUser": idVictime.id}})
        if (userInTheGame == null) {
            throw new CodeError('This user is not in a game', status.BAD_REQUEST)
        }
        if (userInTheGame.vie == "M") {
            throw new CodeError('You cannot contaminate dead people', status.BAD_REQUEST)
        }
        if (userInTheGame.role == "LG"){
            throw new CodeError(victime + ' is already a werewolf', status.BAD_REQUEST)
        }
        
        if (userInTheGame.pouvoir == "I") {
            await usersInGames.update({"role": "LG", "pouvoir": "R"}, {where: {"idUser": idVictime.id}})
        } else {
            await usersInGames.update({"role": "LG"}, {where: {"idUser": idVictime.id}})
        }
        await usersInGames.update({"pouvoirUtilise": true}, {where: {"idUser": idContaminator}})
        res.json({status: true, message: 'Villager converted into werewolf'})
        
    },

    async selectAVictimForSeer (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'victime')) {
            throw new CodeError('You have not specified a message !', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data)
        const victime = data.victime
        const username = req.login
        let idSeer = (await userModel.findOne({where: {"username": username}})).id
        const seerInGame = await usersInGames.findOne({where: {"idUser": idSeer}})
        if (seerInGame == null) {
            throw new CodeError('You are not in a game', status.BAD_REQUEST)
        }
        if (seerInGame.pouvoir != "V") {
            throw new CodeError('You are not a seer', status.BAD_REQUEST)
        }
        if (seerInGame.pouvoirUtilise) {
            throw new CodeError('You have already used your power for today', status.FORBIDDEN)
        }

        let {idGame} = req.params

        const game = await inGameModel.findOne({where: {"id": idGame}})
        if (game == null) {
            throw new CodeError('This game does not exist', status.BAD_REQUEST)
        }
        if (game.moment != "N") {
            throw new CodeError('You can\'t use your power during the day', status.FORBIDDEN)
        }

        const idVictime = await userModel.findOne({where: {"username": victime}})
        if (idVictime == null) {
            throw new CodeError('This user does not exist', status.BAD_REQUEST)
        }
        const userInTheGame = await usersInGames.findOne({where: {"idUser": idVictime.id}})
        if (userInTheGame == null) {
            throw new CodeError('This user is not in a game', status.BAD_REQUEST)
        }
        
        const role = userInTheGame.role
        const pouvoir = userInTheGame.pouvoir
        await usersInGames.update({"pouvoirUtilise": true}, {where: {"idUser": idSeer}})
        res.json({status: true, message: 'This is the role and power of ' + victime, role, pouvoir})
        
    },

    async getInfos (req, res) {
        let {idGame} = req.params
        let gameInfo = await inGameModel.findOne({where: {"id": parseInt(idGame)}, attributes: ['nbJoueurs', 'dureeJour', 'dureeNuit', 'nbLG', 'probaV', 'probaS', 'probaI', 'probaC', 'moment']})
        if (gameInfo == null) {
            throw new CodeError('This game does not exist', status.BAD_REQUEST)
        }
        res.json({status: true, message: 'Info from game ' + idGame, gameInfo})
    }

}

let finUrne = async (idGame) => {
    let urne = await urneModel.findOne({where: {"idGame": idGame}})
    let idVictime = urne.idVictime
    let nbUsersVote = urne.nbUsersVote
    let votesPour = urne.votesPour

    
}
