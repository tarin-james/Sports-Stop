const express = require('express');
const router = express.Router();

const auctionController = require('../controllers/auction');

router.get('/', auctionController.getAll);

router.get('/:id', auctionController.getSingle);

router.post('/', auctionController.createAuction);

router.put('/:id', auctionController.updateAuction);

router.delete('/:id', auctionController.deleteAuction);

module.exports = router;