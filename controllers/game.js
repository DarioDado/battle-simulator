const Game = require('../models/game');

exports.getGames = async (req, res) => {
	const games = await Game.find();

	res.json({
		status: 200,
		data: games,
	});
};

exports.startGame = async (req, res) => {
	res.json({
		status: 200,
		data: {
			message: 'test start game',
		},
	});
};

exports.getGameInfo = (req, res) => {
	const { gameId } = req.params;

	res.json({
		status: 200,
		data: {
			message: 'test get game info',
			data: { gameId },
		},
	});
};

exports.resetGame = (req, res) => {
	const { gameId } = req.body;

	res.json({
		status: 200,
		data: {
			message: 'test reset game',
			data: { gameId },
		},
	});
};
