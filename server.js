const express = require('express');
const bodyParser = require('body-parser');

const armyRoutes = require('./routes/army');
const gameRoutes = require('./routes/game');

const app = express();


app.use(bodyParser.json());

app.use(armyRoutes);
app.use(gameRoutes);

app.listen(3000);
