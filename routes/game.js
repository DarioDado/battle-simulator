const express = require('express');
const gameController = require('../controllers/game');

const router = express.Router();

router.get('/list-games', gameController.getGames);
router.post('/start-game', gameController.startGame);
router.get('/game-info/:gameId', gameController.getGameInfo);
router.post('/reset-game', gameController.resetGame);

module.exports = router;
