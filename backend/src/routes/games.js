const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');
const games = require('../controllers/games.js');

// Mettre ici routes relatives aux games

router.post('/createSession', user.verificationUser, games.createSession);

//router.delete('/createSession/:idSession', user.verificationUser, games.destroySession);

router.get('/joinSession/:idSession', user.verificationUser, games.getSessionParam);

router.post('/joinSession/:idSession', user.verificationUser, games.joinSession);

router.get('/joinSession/:idSession/users', games.getUsersSession);

router.get('/joinSession/:idSession/time', games.returnTimeLeft);

module.exports = router;