const Sequelize = require('sequelize');

const db = require('./database.js');

const salleEspiritisme = db.define('SallesEspiritismes', {
    idGame: {
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    espiritiste: {
        type: Sequelize.STRING,
        allowNull: false
    },
    victime: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    dejaChange: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

}, { timestamps: false })

module.exports = salleEspiritisme