const express = require('express');
const router = express.Router();
const game = require('../controllers/gameController');

router.get('/games', game.getGames);
router.post('/games', game.createGame);
router.put('/games/:game_id', game.finishGame);
router.delete('/games/:game_id', game.deleteGame);

module.exports = router;