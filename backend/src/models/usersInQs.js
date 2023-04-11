const Sequelize = require('sequelize');

const db = require('./database.js');

const usersInQs = db.define('UsersInQs', {
    idUser: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true
    },
    idGame: {
        type: Sequelize.INTEGER
    }

}, { timestamps: false })

module.exports = usersInQs;