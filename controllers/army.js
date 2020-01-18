const Army = require('../models/army');
const Game = require('../models/game');

exports.addArmy = async (req, res) => {
	const { name, units, attackStrategy } = req.body;

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
