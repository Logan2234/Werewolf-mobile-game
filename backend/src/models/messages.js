const Sequelize = require('sequelize');

const db = require('./database.js');

const message = db.define('Messages', {
    idMessage: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    idLieu: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    archive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    timePosted: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }

}, { timestamps: false });

module.exports = message;