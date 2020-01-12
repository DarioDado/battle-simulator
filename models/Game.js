const mongoose = require('mongoose');

const { Schema } = mongoose;

const gameSchema = new Schema({
	status: {
		type: String,
		required: true,
		enum: ['open', 'inProgress', 'close'],
	},
	armies: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Army',
		},
	],
	logFileName: {
		type: String,
	},
	champion: {
		type: Schema.Types.ObjectId,
		ref: 'Army',
	},
});

module.exports = mongoose.model('Game', gameSchema);
