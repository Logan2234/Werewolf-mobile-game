const express = require('express');
const router = express.Router();


const user = require('../controllers/user.js');



router.post('/signin', user.signIn);

router.post('/login', user.logIn);

router.get('/user/game', user.verificationUser, user.checkWhereIAm)

// router.post('/createSession', user.newSession);

// router.delete('/createSession', user.deleteSession);


module.exports = router;