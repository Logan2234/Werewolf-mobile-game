const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');
const inGames = require('../controllers/ingames.js');

router.get('/game/:idGame/place', user.verificationUser, inGames.getMessagesFromPlace);


module.exports = router