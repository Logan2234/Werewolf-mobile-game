const Sequelize = require('sequelize');

const db = require('./database.js');

const lieu = db.define('Lieus', {
    idLieu: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    idPartie: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    typeLieu: {
        // ! Attention ! Le lieu ne peut être que : E (Espiritisme), R (Repère) ou P (Place du village)
        type: Sequelize.STRING,
        allowNull: false
    }

}, { timestamps: false });

module.exports = lieu;