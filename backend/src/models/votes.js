const Sequelize = require('sequelize');

const db = require('./database.js');

const vote = db.define('votes', {
    idVote: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true
    },
    idUrne: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idGame: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, { timestamps: false });

module.exports = vote;