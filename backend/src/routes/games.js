const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');
const games = require('../controllers/games.js');

// Mettre ici routes relatives aux games

router.post('/createSession', user.verificationUser, games.createSession);

// router.delete('/createSession', user.deleteSession);

// router.get('/joinSession/:idSession', user.getSessionParam);

// router.post('/joinSession/:idSession', user.joinSession);

module.exports = router;