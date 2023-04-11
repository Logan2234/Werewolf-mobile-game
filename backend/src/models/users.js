
const Sequelize = require('sequelize');
const db = require('./database.js');


const users = db.define('users', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    username: {
        unique: true,
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    }

}, { timestamps: false })

module.exports = users;