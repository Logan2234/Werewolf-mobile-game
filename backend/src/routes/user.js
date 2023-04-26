const express = require('express');
const router = express.Router();


const user = require('../controllers/user.js');



router.post('/signin', user.signIn);

router.post('/login', user.logIn);

router.get('/user/game', user.verificationUser, user.checkWhereIAm)

router.get('/user/status', user.verificationUser, user.getRole)

router.get('/whoami', user.verificationUser, user.whoAmI);


module.exports = router;