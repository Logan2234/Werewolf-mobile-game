const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');
const inGames = require('../controllers/ingames.js');

// Messagerie

router.get('/game/:idGame/messages/place', user.verificationUser, inGames.getMessagesFromPlace);
router.get('/game/:idGame/messages/repere', user.verificationUser, inGames.getMessagesFromRepere);
router.get('/game/:idGame/messages/spiritism', user.verificationUser, inGames.getMessagesFromSpiritismRoom);

router.post('/game/:idGame/messages/place', user.verificationUser, inGames.sendMessageToPlace);
router.post('/game/:idGame/messages/repere', user.verificationUser, inGames.sendMessageToRepere);
router.post('/game/:idGame/messages/spiritism', user.verificationUser, inGames.sendMessageToSpiritismRoom);

// État de la partie

router.get('/game/:idGame/alives', inGames.getAliveUsers);
router.get('/game/:idGame/deads', inGames.getDeadUsers);
router.get('/game/:idGame/info', inGames.getInfos);

// Actions 

router.post('/game/:idGame/actions/spiritism', user.verificationUser, inGames.selectAVictimForSpiritism);
router.post('/game/:idGame/actions/contamination', user.verificationUser, inGames.selectAVictimForContaminator);
router.post('/game/:idGame/actions/voyance', user.verificationUser, inGames.selectAVictimForSeer);

// Vote 

router.post('/game/:idGame/vote/start', user.verificationUser, inGames.startUrne);
router.post('/game/:idGame/vote', user.verificationUser, inGames.vote);

module.exports = router