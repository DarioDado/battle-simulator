const mongoose = require('mongoose');

const { Schema } = mongoose;

const gameSchema = new Schema({
	status: {
		type: String,
		required: true,
		default: 'open',
		enum: ['open', 'inProgress', 'close'],
	},
	armies: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Army',
		},
	],
	winner: {
		type: Schema.Types.ObjectId,
		ref: 'Army',
	},
	startedAt: {
		type: Number,
	},
});

module.exports = mongoose.model('Game', gameSchema);
