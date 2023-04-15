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
    // ! Attention ! Le rôle ne peut être que : V ou LG
    role: { 
        type: Sequelize.STRING,
        allowNull: false,
    },
    pouvoir: {
        // ! Attention ! Le pouvoir ne peut être que : V, S, I, C ou R (pour rien)
        type: Sequelize.STRING,
        allowNull: false,
    },
    vie: {
    // ! Attention ! La vie ne peut être que : V ou M
        type: Sequelize.STRING,
        allowNull: false,
    },
    pouvoirUtilise: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

}, { timestamps: false })

module.exports = usersInGames;