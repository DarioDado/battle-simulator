const mongoose = require('mongoose');
const Game = require('../models/game');
const Log = require('../models/log');
const BattleSimulator = require('../services/battleSimulator');
const config = require('../config');
const LoggingService = require('../services/loggingService');

/**
 * Fetch all games
 *
 * @param {Object} req
 * @param {Object} res
 * @return {void}
 */
exports.getGames = async (req, res) => {
	const games = await Game.find();

	res.status(200).json({
		data: {
			message: 'Fetch games - success',
			games,
		},
	});
};

/**
 * Start battle if there is open game and enaugh armies
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {void}
 */
exports.startGame = async (req, res) => {
	const openGame = await Game.findOne()
		.where('status').equals('open')
		.populate('armies');

	if (!openGame) {
		return res.status(400).json({
			data: {
				message: 'There is no open game at the moment.',
			},
		});
	}

	if (openGame.armies.length < config.battleSimulator.minArmiesPerGame) {
		return res.status(400).json({
			data: {
				message: 'At least 10 armies are required.',
			},
		});
	}

	BattleSimulator.startGame(openGame);

	res.status(200).json({
		data: {
			message: 'Battle has been successfully started.',
			game: openGame,
		},
	});
};


/**
 * Fetch game info data and logs
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {void}
 */
exports.getGameInfo = async (req, res) => {
	const { gameId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(gameId)) {
		return res.status(400).json({
			data: {
				message: 'Invalid game id.',
			},
		});
	}

	const game = await Game.findById(gameId);

	if (!game) {
		return res.status(400).json({
			data: {
				message: 'There is no game with provided id.',
			},
		});
	}

	const gameLogs = await LoggingService.getLogsByGameId(game.id);

	res.status(200).json({
		data: {
			message: 'Fetch game info - success',
			game,
			logs: gameLogs,
		},
	});
};

/**
 * Reset game in progress by provided game id
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {void}
 */
exports.resetGame = async (req, res) => {
	const { gameId } = req.body;

	if (!mongoose.Types.ObjectId.isValid(gameId)) {
		return res.status(400).json({
			data: {
				message: 'Invalid game id.',
			},
		});
	}

	const game = await Game.findById(gameId).populate('armies');

	BattleSimulator.resetGame(game);

	res.status(200).json({
		data: {
			message: 'Battle has been successfully reseted',
			game,
		},
	});
};
