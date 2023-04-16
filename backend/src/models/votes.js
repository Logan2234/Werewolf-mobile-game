const Sequelize = require('sequelize');

const db = require('./database.js');

const vote = db.define('Votes', {
    idUser: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idGame: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, { timestamps: false })

module.exports = vote