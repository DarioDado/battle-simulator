const Game = require('../models/game');
const Log = require('../models/log');
const BattleSimulator = require('../services/battleSimulator');

exports.getGames = async (req, res) => {
	const games = await Game.find();

	res.json({
		status: 200,
		data: games,
	});
};

exports.startGame = async (req, res) => {
	const openGame = await Game.findOne()
		.where('status').equals('open')
		.populate('armies');

	// if (!openGame) {
	// 	return res.json({
	// 		status: 400,
	// 		data: {
	// 			message: 'There is no open game at the moment.',
	// 		},
	// 	});
	// }

	BattleSimulator.startGame(openGame);

	res.json({
		status: 200,
		data: {
			message: 'game started',
			data: openGame,
		},
	});
};

exports.getGameInfo = async (req, res) => {
	const { gameId } = req.params;

	const game = await Game.findById(gameId);

	const gameLogs = await Log.find()
		.where('game').equals(game.id)
		.sort({ timestamp: 1 });

	res.json({
		status: 200,
		data: {
			message: 'test get game info',
			data: { game, gameLogs },
		},
	});
};

exports.resetGame = async (req, res) => {
	const { gameId } = req.body;

	const game = await Game.findById(gameId).populate('armies');

	BattleSimulator.resetGame(game);

	res.json({
		status: 200,
		data: {
			message: 'test reset game',
			data: { game },
		},
	});
};
