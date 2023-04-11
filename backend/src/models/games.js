const Sequelize = require('sequelize');

const db = require('./database.js');

const session = db.define('Games', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    nbMinJoueurs: {
        type: Sequelize.INTEGER,
        defaultValue: 5
    },
    nbMaxJoueurs: {
        type: Sequelize.INTEGER,
        defaultValue: 10
    },
    debutJour: {
        type: Sequelize.INTEGER,
        defaultValue: 480
    },
    finJour: {
        type: Sequelize.INTEGER,
        defaultValue: 1320
    },
    probaLG: {
        type: Sequelize.INTEGER,
        defaultValue: 33
    },
    probaV: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    probaS: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    probaI: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    probaC: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, { timestamps: false })


module.exports = session;