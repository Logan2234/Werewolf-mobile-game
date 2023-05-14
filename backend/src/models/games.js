const Sequelize = require('sequelize');

const db = require('./database.js');

const session = db.define('Games', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    nbMinJoueurs: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
    },
    nbMaxJoueurs: {
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
    probaLG: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 33
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
    dateDebut: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: new Date().getTime()
    }
}, { timestamps: false });


module.exports = session;