const express = require('express');
const armyController = require('../controllers/army');

const router = express.Router();

router.post('/add-army', armyController.addArmy);

module.exports = router;
