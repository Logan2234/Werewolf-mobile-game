const Sequelize = require('sequelize');

const db = require('./database.js');

const usersPlaying = db.define('UsersInQ', {
    idUser: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true
    },
    idGame: {
        type: Sequelize.INTEGER
    }

}, { timestamps: false })

module.exports = usersPlaying;