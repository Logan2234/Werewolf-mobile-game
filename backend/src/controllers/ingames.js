const status = require('http-status');

const gameModel = require('../models/games.js')
const userModel = require('../models/users.js')
const inGameModel = require('../models/inGames.js')
const usersInQModel = require('../models/usersInQs.js')
const lieuModel = require('../models/lieux.js')
const messageModel = require('../models/messages.js')
const urneModel = require('../models/urnes.js')
const CodeError = require('../util/CodeError.js')

const has = require('has-keys')

var timers = {}

module.exports = {
    async startNight(idGame) {
        await inGameModel.update({"moment": "N"}, {where: {"id": idGame}})
        const currentUrne = await urneModel.findOne({where: {"id": idGame}})
        // Hurne
    },

    async getMessagesFromPlace (req, res) {
        const username = req.login
        let {idSession} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await inGameModel.findOne({where: {"idUser": userId, "idGame": parseInt(idSession)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idSession, status.FORBIDDEN)
        const idLieu = await lieuModel.findOne({where: {"id": idSession, "typeLieu": "P"}})
        if (userInGame.vie == "M") {
            const messages = await messageModel.findAll({where: {"idLieu": idLieu}})
            res.json({status: true, message: 'Messages of the Central Place from the beginning', messages})
            return
        } else {
            const messages = await messageModel.findAll({where: {"idLieu": idLieu, "archive": false}})
            res.json({status: true, message: 'Messages of the Central Place', messages})
            return
        }
    },

    async getMessagesFromRepere (req, res) {
        const username = req.login
        let {idSession} = req.params
        const userId = (await userModel.findOne({where: {username}})).id
        const userInGame = await inGameModel.findOne({where: {"idUser": userId, "idGame": parseInt(idSession)}})
        if (!userInGame) throw new CodeError(username + ' is not in game ' + idSession, status.FORBIDDEN)
        const idLieu = await lieuModel.findOne({where: {"id": idSession, "typeLieu": "R"}})
        if (userInGame.vie == "M") {
            const messages = await messageModel.findAll({where: {"idLieu": idLieu}})
            res.json({status: true, message: 'Messages of the lair of werewolves from the beginning', messages})
            return
        } else {
            if (userInGame.role == "LG" || userInGame.pouvoir == "I") {
                const messages = await messageModel.findAll({where: {"idLieu": idLieu, "archive": false}})
                res.json({status: true, message: 'Messages of the lair of werewolves', messages})
                return
            } else {
                throw new CodeError(username + ' have no access to the messages of the lair of werewolves ' + idSession, status.FORBIDDEN)
            }
        }
    }


}
