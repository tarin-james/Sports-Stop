const express = require('express');
const router = express.Router();

const storeController = require('../controllers/stores');
const { isAuthenticated } = require("../middleware/authenticate");
router.get('/', storeController.getAll);

router.get('/:id', storeController.getSingle);

router.post('/', isAuthenticated, storeController.createStore);

router.put('/:id', isAuthenticated, storeController.updateStore);

router.delete('/:id', isAuthenticated, storeController.deleteStore);

module.exports = router;