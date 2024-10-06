const router = require('express').Router();

router.use('/', require('./swagger'));

router.use('/auctions', require('./auction'));

router.use('/users', require('./users'));


module.exports = router;