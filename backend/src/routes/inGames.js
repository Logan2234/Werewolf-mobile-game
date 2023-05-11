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

router.get('/game/:idGame/messages/place/check', user.verificationUser, inGames.canISendAMessageToPlace)
router.get('/game/:idGame/messages/repere/check', user.verificationUser, inGames.canISendAMessageToRepere)
router.get('/game/:idGame/messages/spiritism/check', user.verificationUser, inGames.canISendAMessageToSpiritismRoom)

// État de la partie

router.get('/game/:idGame/alives', inGames.getAliveUsers);
router.get('/game/:idGame/deads', inGames.getDeadUsers);
router.get('/game/:idGame/werewolves', inGames.getWerewolves);
router.get('/game/:idGame/info', inGames.getInfos);
router.get('/game/:idGame/time', inGames.returnTimeLeft);

// Actions

router.post('/game/:idGame/actions/spiritism', user.verificationUser, inGames.selectAVictimForSpiritism);
router.post('/game/:idGame/actions/contamination', user.verificationUser, inGames.selectAVictimForContaminator);
router.post('/game/:idGame/actions/voyance', user.verificationUser, inGames.selectAVictimForSeer);

// Vote

router.get('/game/:idGame/vote', inGames.getInfoVotes);
router.post('/game/:idGame/vote/start', user.verificationUser, inGames.startUrne);
router.post('/game/:idGame/vote', user.verificationUser, inGames.vote);
router.get('/game/:idGame/vote/free-users', inGames.notVictimsYet)
router.get('/game/:idGame/vote/check', user.verificationUser, inGames.canIVote)
router.get('/game/:idGame/vote/check-see', user.verificationUser, inGames.canISeeTheVote)
router.get('/game/:idGame/vote/info', user.verificationUser, inGames.myVoteInfo)

module.exports = router