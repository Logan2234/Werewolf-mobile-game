const router = require('express').Router();


// Users routes

router.use(require('./user'));
router.use(require('./games'));
router.use(require('./inGames'));


module.exports = router;