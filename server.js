const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const armyRoutes = require('./routes/army');
const gameRoutes = require('./routes/game');

const app = express();


app.use(bodyParser.json());

app.use(armyRoutes);
app.use(gameRoutes);

mongoose.connect('mongodb+srv://user1:battlesimulator123@cluster0-jxozd.mongodb.net/battle-simulator?retryWrites=true&w=majority')
	.then(() => {
		console.log('Connected!');
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
