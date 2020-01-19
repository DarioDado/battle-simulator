const Log = require('../models/log');

class LoggingService {
	/**
	 * Create new log and save it to database
	 *
	 * @static
	 * @param {String} type
	 * @param {Number} timestamp
	 * @param {Game} game
	 * @param {Object} data
	 */
	static log(type, timestamp, game, data) {
		const log = new Log({
			type,
			timestamp,
			game,
			data,
		});
		log.save();
	}

	/**
	 * Fetch logs by game id and log type
	 *
	 * @static
	 * @param {String} gameId
	 * @param {String} logType
	 * @return {[Log]}
	 */
	static async getLogsByGameIdAndType(gameId, logType) {
		const gameLogs = await Log.find()
			.where('game').equals(gameId)
			.where('type').equals(logType)
			.sort({ timestamp: 1 });
		return gameLogs;
	}

	/**
	 * Fetch all logs by game id
	 *
	 * @static
	 * @param {String} gameId
	 * @param {String} logType
	 * @return {[Log]}
	 */
	static async getLogsByGameId(gameId) {
		const gameLogs = await Log.find()
			.where('game').equals(gameId)
			.sort({ timestamp: 1 });
		return gameLogs;
	}
}

module.exports = LoggingService;
