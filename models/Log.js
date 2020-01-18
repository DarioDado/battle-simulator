const mongoose = require('mongoose');

const { Schema } = mongoose;

const logSchema = new Schema({
	type: {
		type: String,
		required: true,
		default: 'open',
		enum: ['startGame', 'resetGame', 'attack', 'endGame'],
	},
	game: {
		type: Schema.Types.ObjectId,
		ref: 'Game',
	},
	timestamp: {
		type: Number,
		required: true,
	},
	data: {
		type: Object,
	},
});

module.exports = mongoose.model('Log', logSchema);
