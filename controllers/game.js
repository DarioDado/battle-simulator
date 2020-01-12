exports.getGames = (req, res) => {
	res.json({
		status: 200,
		data: {
			message: 'test get games',
		},
	});
};

exports.startGame = (req, res) => {
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
