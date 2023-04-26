const Sequelize = require('sequelize');

const db = require('./database.js');

const urne = db.define('urnes', {
    idUrne: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true
    },
    idGame: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idVictime: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nbUsersVote: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    votesPour: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    votesContre: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, { timestamps: false })

module.exports = urne