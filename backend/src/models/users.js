
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
        validate: {
            is: /^[a-z\-'\s]{1,32}$/i
        }
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            is: /^[a-z\-'\s]{1,32}$/i
        }
    }

}, { timestamps: false })

module.exports = users;