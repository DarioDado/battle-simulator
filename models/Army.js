const mongoose = require('mongoose');

const { Schema } = mongoose;

const armySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	units: {
		type: Number,
		required: true,
	},
	attackStrategy: {
		type: String,
		required: true,
		enum: ['random', 'weakest', 'strongest'],
	},
});

module.exports = mongoose.model('Army', armySchema);
