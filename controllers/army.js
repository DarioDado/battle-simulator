const Army = require('../models/army');
const Game = require('../models/game');

exports.addArmy = async (req, res) => {
	const { name, units, attackStrategy } = req.body;

	if (units < 80 || units > 100) {
		return res.status(400).json({
			data: {
				message: 'Units need to be between 80 and 100.',
			},
		});
	}

	if (typeof units !== 'number') {
		return res.status(400).json({
			data: {
				message: 'Invalid units format.',
			},
		});
	}

	const army = new Army({ name, units, attackStrategy });

	const createdArmy = await army.save();

	let openGame = await Game.findOne()
		.where('status').equals('open');
	openGame = !openGame ? new Game() : openGame;
	openGame.armies.push(createdArmy);
	await openGame.save();


	res.status(200).json({
		data: {
			message: 'Army has been successfully created',
			army: createdArmy,
			game: openGame,
		},
	});
};
