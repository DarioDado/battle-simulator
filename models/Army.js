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
	},
	isUnderAttack: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('Army', armySchema);
