const events = require('events');
const Game = require('../models/game');
const config = require('../config');
const LoggingService = require('./loggingService');

const eventEmitter = new events.EventEmitter();

class BattleSimulator {
	/**
	 * Update game's status, add event listeners, emit startGame event and log start game action
	 *
	 * @param {Game} game
	 * @return {void}
	 */
	static startGame(game) {
		game.startedAt = Date.now();
		game.status = 'inProgress';
		game.save();

		game.armies.forEach((army) => {
			eventEmitter.once(`gameStarted_${game.id}`, startGameListener.bind(null, army));
			eventEmitter.addListener(`armyAttacked_${army.id}_${game.startedAt}`, attackArmyListener);
		});

		eventEmitter.emit(`gameStarted_${game.id}`, game);

		LoggingService.log('startGame', Date.now(), game, null);
	}

	/**
	 * Remove event listeners, log reset game action and start game again
	 *
	 * @param {Game} game
	 * @return {void}
	 */
	static resetGame(game) {
		game.armies.forEach((army) => {
			eventEmitter.removeAllListeners(`armyAttacked_${army.id}_${game.startedAt}`);
		});
		console.log('reset');

		LoggingService.log('resetGame', Date.now(), game, null);

		this.startGame(game);
	}

	/**
	 * If there is interrupted game, fetch logs and recreated battle from it
	 *
	 * @return {void}
	 */
	static async finishInterruptedBattle() {
		const interruptedGame = await Game.findOne()
			.where('status').equals('inProgress')
			.populate('armies');
		if (interruptedGame) {
			const gameLogs = await LoggingService.getLogsByGameIdAndType(interruptedGame.id, 'attack');

			gameLogs.forEach((log) => {
				const attackedArmyIndex = interruptedGame.armies.findIndex((army) => army.id === log.data.underAttackArmyId);
				interruptedGame.armies[attackedArmyIndex].units -= log.data.damage;
			});

			this.startGame(interruptedGame);
		} else {
			console.log('There is no interrupted games.');
		}
	}
}

/**
 * Start game event handler. Start attack
 *
 * @param {Army} armyListener
 * @param {*} game
 */
function startGameListener(armyListener, game) {
	console.log('game with id', game.id, 'started for', armyListener.name, 'units', armyListener.units);
	attack(armyListener, game);
}

/**
 * Attack event handler. Get attack success status, calculate damage and log attack
 *
 * @param {Army} underAttackArmy
 * @param {Army} invadingArmy
 * @param {Game} game
 */
function attackArmyListener(underAttackArmy, invadingArmy, game) {
	if (isAttackSuccessful(invadingArmy.units)) {
		if (underAttackArmy.units > 0 && invadingArmy.units > 0) {
			let damage = Math.floor(invadingArmy.units * config.battleSimulator.damagePerUnit);
			damage = (damage > underAttackArmy.units) ? underAttackArmy.units : damage;
			underAttackArmy.units -= damage;
			console.log('invadingArmy', invadingArmy.name, 'underAttackArmy', underAttackArmy.name, 'units', underAttackArmy.units);

			const logData = {
				invadingArmyId: invadingArmy.id,
				invadingArmyName: invadingArmy.name,
				underAttackArmyId: underAttackArmy.id,
				underAttackArmyName: underAttackArmy.name,
				damage,
			};
			LoggingService.log('attack', Date.now(), game, logData);
		}
	} else {
		console.log('invadingArmy', invadingArmy.name, 'unsuccessful attack');
	}
}

/**
 * Select army to attack , calculate reload time and attack again. (recursion)
 * Attack until there is no units or no armies to attack
 * When game is over remove event listeners, update game and armies and log end game action
 *
 * @param {Army} invadingArmy
 * @param {Game} game
 * @return {void}
 */
function attack(invadingArmy, game) {
	const fileredArmies = game.armies.filter((army) => (army.id !== invadingArmy.id && army.units !== 0));
	if (fileredArmies.length > 0) {
		if (invadingArmy.units > 0) {
			const underAttackArmy = selectArmyToAttack(game, invadingArmy, fileredArmies);
			const reloadTime = config.battleSimulator.reloadTimePerUnit * invadingArmy.units;
			setTimeout(() => {
				eventEmitter.emit(`armyAttacked_${underAttackArmy.id}_${game.startedAt}`, underAttackArmy, invadingArmy, game);
				attack(invadingArmy, game);
			}, reloadTime);
		}
	} else {
		game.armies.forEach((army) => {
			eventEmitter.removeListener(`armyAttacked_${army.id}_${game.startedAt}`, attackArmyListener);
			army.save();
		});
		game.winner = game.armies.find((army) => army.units > 0);
		game.status = 'close';
		game.save();

		const logData = {
			winnerArmyId: game.winner.id,
			winnerArmyName: game.winner.name,
		};
		LoggingService.log('endGame', Date.now(), game, logData);

		console.log('End game');
	}
}

/**
 * Select army to attack based on inviding army's attack strategy
 *
 * @param {Game} game
 * @param {Army} invadingArmy
 * @param {Army} fileredArmies
 * @returns {Army}
 */
function selectArmyToAttack(game, invadingArmy, fileredArmies) {
	let underAttackArmy = null;

	switch (invadingArmy.attackStrategy) {
	case 'random':
		underAttackArmy = fileredArmies[getRandomInt(fileredArmies.length - 1, 0)];
		break;
	case 'weakest':
		underAttackArmy = getMin(fileredArmies, 'units');
		break;
	case 'strongest':
		underAttackArmy = getMax(fileredArmies, 'units');
		break;
	default:
		break;
	}

	return underAttackArmy;
}

/**
 * Return random number between min and max
 *
 * @param {Number} max
 * @param {Number} min
 * @returns {Number}
 */
function getRandomInt(max, min) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Compare array of objects on specific object property to get object with minimum value
 *
 * @param {Array} array
 * @param {String} attrib
 * @returns {Object}
 */
function getMin(array, attrib) {
	return (array.length && array.reduce((prev, curr) => { 
		return prev[attrib] < curr[attrib] ? prev : curr;
	})) || null;
}

/**
 * Compare array of objects on specific object property to get object with maximum value
 *
 * @param {Array} array
 * @param {String} attrib
 * @returns {Object}
 */
function getMax(array, attrib) {
	return (array.length && array.reduce((prev, curr) => { 
		return prev[attrib] > curr[attrib] ? prev : curr;
	})) || null;
}

/**
 * Fetch attack success status based on army units
 *
 * @param {Number} units
 * @returns {Boolean}
 */
function isAttackSuccessful(units) {
	const randomNumber = getRandomInt(100, 1);
	return randomNumber < units;
}

module.exports = BattleSimulator;
