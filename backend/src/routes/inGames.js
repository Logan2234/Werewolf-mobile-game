const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');
const inGames = require('../controllers/ingames.js');

router.get('/game/:idGame/messages/place', user.verificationUser, inGames.getMessagesFromPlace);
router.get('/game/:idGame/messages/repere', user.verificationUser, inGames.getMessagesFromRepere);
router.get('/game/:idGame/messages/spiritism', user.verificationUser, inGames.getMessagesFromSpiritismRoom);

router.post('/game/:idGame/messages/place', user.verificationUser, inGames.sendMessageToPlace);
router.post('/game/:idGame/messages/repere', user.verificationUser, inGames.sendMessageToRepere);
router.post('/game/:idGame/messages/spiritism', user.verificationUser, inGames.sendMessageToSpiritismRoom);

module.exports = router