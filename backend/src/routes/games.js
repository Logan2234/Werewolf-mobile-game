const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');
const games = require('../controllers/games.js');

// Mettre ici routes relatives aux games

router.post('/createSession', user.verificationUser, games.createSession);

// router.delete('/createSession', user.verificationUser, games.deleteSession);

router.get('/joinSession/:idSession', user.verificationUser, games.getSessionParam);

router.post('/joinSession/:idSession', user.verificationUser, games.joinSession);

module.exports = router;