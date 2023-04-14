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
    }
}

function getTimeLeft(timeout) {
    return Math.ceil((timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000)
}

