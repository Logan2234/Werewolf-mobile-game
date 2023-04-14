const Sequelize = require('sequelize');

const db = require('./database.js');

const game = db.define('InGames', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    nbJoueurs: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
    },
    dureeJour: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 840
    },
    dureeNuit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 600
    },
    nbLG: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    probaV: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    probaS: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    probaI: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    probaC: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    moment: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "N"
    },
    finTimer: {
        type: Sequelize.INTEGER,
        defaultValue: new Date().getTime()
    }
}, { timestamps: false })


module.exports = game;