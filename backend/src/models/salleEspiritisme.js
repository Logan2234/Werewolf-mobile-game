const Sequelize = require('sequelize');

const db = require('./database.js');

const salleEspiritisme = db.define('SallesEspiritisme', {
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
    }

}, { timestamps: false })

module.exports = salleEspiritisme