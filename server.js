const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const armyRoutes = require('./routes/army');
const gameRoutes = require('./routes/game');
const config = require('./config');
const BattleSimulator = require('./services/battleSimulator');

const app = express();

app.use(bodyParser.json());

app.use(armyRoutes);
app.use(gameRoutes);

mongoose.connect(config.db.connectionString)
	.then(() => {
		console.log('Connected!');
		BattleSimulator.finishInterruptedBattle();
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
