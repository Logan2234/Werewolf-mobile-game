const router = require('express').Router();


// Users routes

router.use(require('./user'));
router.use(require('./games'));


module.exports = router;