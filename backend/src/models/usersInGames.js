const Sequelize = require('sequelize');

const db = require('./database.js');

const usersInGames = db.define('UsersInGames', {
    idUser: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true
    },
    idGame: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // ! Attention ! Le rôle ne peut être que : V, S, I, C, VI ou LG
    role: { 
        type: Sequelize.STRING,
        allowNull: false,
    }

}, { timestamps: false })

module.exports = usersInGames;