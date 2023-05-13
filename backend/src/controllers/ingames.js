const status = require('http-status');

const gameModel = require('../models/games.js')
const userModel = require('../models/users.js')
const inGameModel = require('../models/inGames.js')
const lieuModel = require('../models/lieus.js')
const messageModel = require('../models/messages.js')
const urneModel = require('../models/urnes.js')
const voteModel = require('../models/votes.js')
const salleEspiritismeModel = require('../models/salleEspiritisme.js')
const usersInGames = require('../models/usersInGames.js');
const CodeError = require('../util/CodeError.js')

const has = require('has-keys');

var timers = {}

module.exports = {

    async canISendAMessageToPlace(req, res) {
        // #swagger.tags = ['InGames']
        // #swagger.summary = 'Return if the user can send a message to the main place.'

        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        if (userInGame.vie == "M") {
            res.json({status: false, message: 'You cannot send a message to the main place'})
            return
        } else {
            const session = await inGameModel.findOne({where: {"id": idGame}})
            if (session.moment != "J") {
                res.json({status: false, message: 'You cannot send a message to the main place'})
                return
            }
            res.json({status: true, message: 'You can send a message to the main !'})
            return
        }
    },

    async canISendAMessageToRepere(req, res) {
        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        if (userInGame.vie == "M") {
            res.json({status: false, message: 'You cannot send a message'})
            return
        } else {
            if (userInGame.role == "LG") {
                const session = await inGameModel.findOne({where: {"id": idGame}})
                if (session.moment != "N") {
                    res.json({status: false, message: 'You cannot send a message'})
                    return
                }
                res.json({status: true, message: 'You can send a message !'})
                return
            } else {
                res.json({status: false, message: 'You cannot send a message'})
                return
            }
        }
    },

    async canISendAMessageToSpiritismRoom (req, res) {
        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        const Lieu = await lieuModel.findOne({where: {"idPartie": idGame, "typeLieu": "E"}})
        if (!Lieu) throw new CodeError('No spiritism room in game ' + idGame, status.NOT_FOUND)

        if (userInGame.vie == "M") {
            res.json({status: false, message: 'You cannot send a message'})
            return
        } else {
            if (userInGame.pouvoir == "S") {
                const session = await inGameModel.findOne({where: {"id": idGame}})
                if (session.moment != "N") {
                    res.json({status: false, message: 'You cannot send a message'})
                    return
                }
                res.json({status: true, message: 'You can send a message !'})
                return
            } else {
                res.json({status: false, message: 'You cannot send a message'})
                return
            }
        }
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
                throw new CodeError(username + ' can\'t send messages to the lair of werewolves', status.FORBIDDEN)
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
                throw new CodeError(username + ' can\'t send messages to the spiritism room', status.FORBIDDEN)
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

    async getAliveHumans (req, res) {
        let {idGame} = req.params
        const users = await usersInGames.findAll({where: {"idGame": parseInt(idGame), "vie": "V", "role": "V"}, attributes: ['idUser']})
        var aliveUsers = []
        let aux = ""
        for (let i = 0; i < users.length; i++) {
            aux = (await userModel.findOne({where: {"id": users[i].idUser}})).username
            aliveUsers.push(aux)
        }
        res.json({status: true, message: 'List of alive villagers', aliveUsers})
    },

    async checkActionUsed (req, res) {
        let {idGame} = req.params

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
            throw new CodeError('You have not specified a victim !', status.BAD_REQUEST)
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
            throw new CodeError('You have not specified a victim !', status.BAD_REQUEST)
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
        await checkIfEndGame(idGame)

    },

    async selectAVictimForSeer (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'victime')) {
            throw new CodeError('You have not specified a victim !', status.BAD_REQUEST)
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
        if (userInTheGame.vie == "M") {
            throw new CodeError('You cannot look for dead people', status.BAD_REQUEST)
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
    },

    async startUrne (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'victime')) {
            throw new CodeError('You have not specified a victim !', status.BAD_REQUEST)
        }

        const data = JSON.parse(req.body.data)
        const victime = data.victime
        const username = req.login
        let {idGame} = req.params
        const idUser = await userModel.findOne({where: {"username": username}})
        const vote = await voteModel.findOne({where: {"idUser": idUser}})

        if (vote != null) {
            throw new CodeError('You have already voted', status.FORBIDDEN)
        }

        const idVictime = await userModel.findOne({where: {"username": victime}})
        if (idVictime == null) {
            throw new CodeError('This user does not exist', status.NOT_FOUND)
        }

        if ((await urneModel.findOne({where: {"idGame": parseInt(idGame), "idVictime": idVictime.id}})) != null) {
            throw new CodeError('There is already an election in process against ' + victime, status.BAD_REQUEST)
        }

        const game = await inGameModel.findOne({where: {"id": idGame}})
        if (game == null) {
            throw new CodeError('This game does not exist', status.NOT_FOUND)
        }

        if (game.voted) {
            throw new CodeError('A vote has already been submitted', status.BAD_REQUEST)
        }

        const userInTheGame = await usersInGames.findOne({where: {"idUser": idUser.id, "idGame": parseInt(idGame)}})
        if (userInTheGame == null) {
            throw new CodeError('You are not in game ' + idGame, status.FORBIDDEN)
        }
        if (userInTheGame.vie == "M") {
            throw new CodeError('You are dead, and dead people can\'t vote', status.FORBIDDEN)
        }

        let nbJoueurs = 0
        if (game.moment == "J") {
            nbJoueurs = (await usersInGames.findAll({where: {"idGame": parseInt(idGame), "vie": "V"}})).length
        } else {
            nbJoueurs = (await usersInGames.findAll({where: {"idGame": parseInt(idGame), "vie": "V", "role": "LG"}})).length
            if (userInTheGame.role != "LG") {
                throw new CodeError('Only werewolves can vote now', status.FORBIDDEN)
            }
        }

        let victimInGame = await usersInGames.findOne({where: {"idUser": idVictime.id, "idGame": parseInt(idGame)}})
        if (victimInGame == null) {
            throw new CodeError('This user is not in game ' + idGame, status.NOT_FOUND)
        }
        if (victimInGame.vie == "M") {
            throw new CodeError('This user is already dead', status.FORBIDDEN)
        }

        urne = await urneModel.create({"idGame": parseInt(idGame), "idVictime": idVictime.id, "nbUsersVote": nbJoueurs})
        await voteModel.create({"idUrne": urne.idUrne, "idUser": idUser.id, "decision": true, "idGame": idGame})
        res.json({status: true, message: 'You have created a vote against ' + victime})

        if (nbJoueurs == 1) {
            await finUrne(urne.idUrne, idGame)
        }
    },

    async vote (req, res) {
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'decision') || !has(JSON.parse(req.body.data), 'victime')) {
            throw new CodeError('You have not specified an answer to the vote !', status.BAD_REQUEST)
        }
        let {idGame} = req.params

        const data = JSON.parse(req.body.data)
        const victime = data.victime
        const username = req.login
        const idUser = await userModel.findOne({where: {"username": username}})

        const vote = await voteModel.findOne({where: {"idUser": idUser}})

        if (vote != null) {
            throw new CodeError('You have already voted', status.FORBIDDEN)
        }

        let victimeModel = await userModel.findOne({where: {"username": victime}})
        if (victimeModel == null) {
            throw new CodeError('This victim does not exist', status.BAD_REQUEST)
        }
        const victimeId = victimeModel.id

        let urne = (await urneModel.findOne({where: {"idGame": parseInt(idGame), "idVictime": victimeId}}))
        if (urne == null) {
            throw new CodeError('There is no election in process against ' + victime, status.BAD_REQUEST)
        }

        const decision = data.decision
        const game = await inGameModel.findOne({where: {"id": idGame}})

        const userInTheGame = await usersInGames.findOne({where: {"idUser": idUser.id, "idGame": parseInt(idGame)}})
        if (userInTheGame == null) {
            throw new CodeError('You are not in game ' + idGame, status.FORBIDDEN)
        }
        if (userInTheGame.vie == "M") {
            throw new CodeError('You are dead, and dead people can\'t vote', status.FORBIDDEN)
        }

        if ((await voteModel.findOne({where: {"idUrne": urne.idUrne, "idUser": idUser.id}})) != null) {
            throw new CodeError('You have already voted', status.FORBIDDEN)
        }

        if (game.moment == "N" && userInTheGame.role != "LG") {
            throw new CodeError('Only werewolves can vote now', status.FORBIDDEN)
        }

        let seuil = Math.floor(urne.nbUsersVote / 2)
        await voteModel.create({"idUrne": urne.idUrne, "idUser": idUser.id, "decision": decision, "idGame": idGame})
        if (decision == true) {
            await urneModel.update({"votesPour": urne.votesPour + 1}, {where: {"idUrne": urne.idUrne}})
            if (urne.votesPour + 1 > seuil) await finUrne(urne.idUrne, idGame)
            res.json({status: true, message: 'You have voted to kill ' + victime})
        } else {
            await urneModel.update({"votesContre": urne.votesContre + 1}, {where: {"idUrne": urne.idUrne}})
            if (urne.votesContre + 1 > seuil) await finUrne(urne.idUrne, idGame)
            res.json({status: true, message: 'You have voted not to kill ' + victime})
        }
        if (urne.votesContre + urne.votesPour + 1 == urne.nbUsersVote) {
            await finUrne(urne.idUrne, idGame)
        }
    },

    async canIVote(req, res) {
        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        const vote = await voteModel.findOne({where: {"idUser": userId}})

        if (vote != null) {
            throw new CodeError('You have already voted', status.FORBIDDEN)
        }

        if (userInGame.vie == "M") {
            res.json({status: false, message: 'You cannot vote, you are dead'})
            return
        } else {
            const game = await inGameModel.findOne({where: {"id": idGame}})
            if (game.voted) {
                res.json({status: false, message: 'A vote has already been decided'})
                return 
            }
            if (game.moment != "N") {
                res.json({status: true, message: 'You can vote now !'})
                return
            } else {
                if (userInGame.role == "LG") {
                    res.json({status: true, message: 'You can vote now !'})
                    return
                } else {
                    res.json({status: false, message: 'You cannot vote, it is not the right moment'})
                    return
                }
            }
        }
    },

    async canISeeTheVote(req, res) {
        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await usersInGames.findOne({where: {"idUser": userId, "idGame": parseInt(idGame)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idGame, status.FORBIDDEN)
        if (userInGame.vie == "M") {
            res.json({status: true, message: 'You can see the vote !'})
            return
        } else {
            const game = await inGameModel.findOne({where: {"id": idGame}})
            if (game.voted) {
                res.json({status: false, message: 'Too much votes for this night !'})
                return 
            }
            if (game.moment != "N") {
                res.json({status: true, message: 'You can see the vote !'})
                return
            } else {
                if (userInGame.role == "LG" || userInGame.pouvoir == "I") {
                    res.json({status: true, message: 'You can see the vote !'})
                    return
                } else {
                    res.json({status: false, message: 'You cannot see the vote...'})
                    return
                }
            }
        }
    },

    async getInfoVotes (req, res) {
        let {idGame} = req.params

        let urne = (await urneModel.findAll({where: {"idGame": parseInt(idGame)}, attributes: ['idVictime', 'votesPour', 'votesContre', 'nbUsersVote']}))
        if (urne == null) {
            throw new CodeError('There is no election in process', status.BAD_REQUEST)
        }
        let victimes = []
        let votesPour = []
        let votesContre = []
        let nbUsersVote = []
        for (let i = 0; i < urne.length; i++) {
            victimes.push((await userModel.findOne({where: {"id": urne[i].idVictime}})).username)
            votesPour.push(urne[i].votesPour)
            votesContre.push(urne[i].votesContre)
            nbUsersVote.push(urne[i].nbUsersVote)
        }
        res.json({status: true, message: 'Info about the votes in progress', victimes, votesPour, votesContre, nbUsersVote})
    },

    async myVoteInfo (req, res) {
        const username = req.login
        let {idGame} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const game = await inGameModel.findOne({where: {"id": idGame}})

        if (game.voted) {
            throw new CodeError('A vote has already been submitted', status.BAD_REQUEST)
        }

        const vote = await voteModel.findOne({where: {"idUser": userId}})

        if (vote != null) {
            const urne = (await urneModel.findOne({where: {"idUrne": vote.idUrne}}))
            const victime = (await userModel.findOne({where: {"id": urne.idVictime}})).username
            if (vote.decision) {
                res.json({status: true, message: 'You have voted to kill ' + victime, victime})
            } else {
                res.json({status: true, message: 'You have voted not to kill ' + victime, victime})
            }
        } else {
            res.json({ status: false, message: 'You have not voted, yet'})
        }
    },

    async getWerewolves(req, res) {
        let {idGame} = req.params
        let werewolves = await getLG(idGame)
        let nbWerewolves = werewolves.length
        res.json({ status: true, message: 'Info about werewolves', werewolves: werewolves, nbWerewolves: nbWerewolves })
    },

    async returnTimeLeft(req, res) {
        let {idGame} = req.params
        if (await gameModel.findOne({where: {"id": idGame}})) {
            throw new CodeError('Game has not started yet !', status.BAD_REQUEST)
        }

        if (await inGameModel.findOne({where: {"id": idGame}})) {
            const game = await gameModel.findOne({where: {"id": idGame}})
            const timeLeft = game.finTimer - new Date().getTime()
            res.json({status: true, message: 'Time left in ms' + idGame.toString(), timeLeft})
            return
        }

        throw new CodeError("Game doesn't exist", status.BAD_REQUEST)
    },

    async notVictimsYet(req, res) {
        let {idGame} = req.params
        let users = await usersInGames.findAll({where: {"idGame": idGame, "vie": "V"}})
        let usersNotVictims = []
        for (let i = 0; i < users.length; i++) {
            if (!(await urneModel.findOne({where: {"idVictime": users[i].idUser}}))){
                usersNotVictims.push((await userModel.findOne({where: {"id": users[i].idUser}})).username)
            }
        }
        res.json({status: true, message: 'Users not victims yet', usersNotVictims})
    }

}

let finUrne = async (idUrne, idGame) => {
    if (await urneModel.findOne({where: {"idUrne": idUrne}}) == null) {
        return
    }
    let urne = await urneModel.findOne({where: {"idUrne": idUrne}})
    let idVictime = urne.idVictime
    let nbUsersVote = urne.nbUsersVote
    let votesPour = urne.votesPour

    if (votesPour > Math.floor(nbUsersVote / 2)) {
        await usersInGames.update({"vie": "M"}, {where: {"idUser": idVictime}})
        await inGameModel.update({"voted": true}, {where: {"id": idGame}})
    }
    await checkIfEndGame(idGame)
}

let finUrneFinPeriode = async (idGame) => {
    if (await urneModel.findOne({where: {"idGame": idGame}}) == null) {
        return
    }
    let urne = await urneModel.findOne({where: {"idGame": idGame}})
    let idVictime = urne.idVictime
    let nbUsersVote = urne.nbUsersVote
    let votesPour = urne.votesPour

    if (votesPour > Math.floor(nbUsersVote / 2)) {
        await usersInGames.update({"vie": "M"}, {where: {"idUser": idVictime}})
    }
    await urneModel.destroy({where: {"idGame": idGame}})
    await inGameModel.update({"voted": false}, {where: {"id": idGame}})
    await checkIfEndGame(idGame)
}

let startNight = async (idGame) => {
    const game = await inGameModel.findOne({where: {"id": idGame}})
    await inGameModel.update({"voted": false}, {where: {"id": idGame}})
    await finUrneFinPeriode(idGame)
    await inGameModel.update({"moment": "N"}, {where: {"id": idGame}})
    await inGameModel.update({"finTimer": new Date().getTime() + game.dureeNuit}, {where: {"id": idGame}})
    timers[idGame] = setTimeout(() => {await startDay(idGame)}, game.dureeNuit)
}

let startDay = async (idGame) => {
    const game = await inGameModel.findOne({where: {"id": idGame}})
    await inGameModel.update({"voted": false}, {where: {"id": idGame}})
    await finUrneFinPeriode(idGame)
    await inGameModel.update({"moment": "J"}, {where: {"id": idGame}})
    await usersInGames.update({"pouvoirUtilise": false}, {where: {"idGame": idGame}})
    await inGameModel.update({"finTimer": new Date().getTime() + game.dureeJour}, {where: {"id": idGame}})
    timers[idGame] = setTimeout(() => {await startNight(idGame)}, game.dureeJour)
}

let finGame = async (idGame) => {
    const game = await inGameModel.findOne({where: {"id": idGame}})
    await inGameModel.destroy({where: {"id": idGame}})
    await usersInGames.destroy({where: {"idGame": idGame}})
    await urneModel.destroy({where: {"idGame": idGame}})

    const lieux = await lieuModel.findAll({where: {"idGame": idGame}})
    for (let i = 0; i < lieux.length; i++) {
        await messageModel.destroy({where: {"idLieu": lieux[i].id}})
    }

    await lieuModel.destroy({where: {"idPartie": idGame}})
    clearTimeout(timers[idGame])
    delete timers[idGame]
}

let getLG = async (idGame) => {
    let playersLG = await usersInGames.findAll({where: {"idGame": parseInt(idGame), "vie": "V", "role": "LG"}})
    if (playersLG == null) {
        return []
    }
    let LGUsers = []
    for (let i = 0; i < playersLG.length; i++) {
        LGUsers.push((await userModel.findOne({ where: { "id": playersLG[i].idUser } })).username)
    }
    return LGUsers
}

let checkIfEndGame = async (idGame) => {
    let nbWerewolves = getLG(idGame)
    let aliveUsers = await usersInGames.findAll({where: {"idGame": parseInt(idGame), "vie": "V"}})
    if (aliveUsers == null || nbWerewolves == 0 || nbWerewolves >= aliveUsers.length) {
        await finGame(idGame)
    }
}
