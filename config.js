const database = 'battle-simulator';
const dbUsername = 'user1';
const dbPassword = 'battlesimulator123';

module.exports = {
	db: {
		/**
		 *  MongoDB connection string
		 */
		connectionString: `mongodb+srv://${dbUsername}:${dbPassword}@cluster0-jxozd.mongodb.net/${database}?retryWrites=true&w=majority`,
	},
	battleSimulator: {
		/**
		 * The army always does 0.5 damage per unit
		 */
		damagePerUnit: 0.5,
		/**
		 * Reload time takes 0.01 seconds (10ms) per 1 unit in the army.
		 */
		reloadTimePerUnit: 10,
		/**
		 * At least 10 armies are required per game
		 */
		minArmiesPerGame: 10,
	},
};
