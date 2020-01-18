const events = require('events');

const eventEmitter = new events.EventEmitter();

class BattleSimulator {
	static startGame(game) {
		game.startedAt = Date.now();
		game.status = 'inProgress';
		game.save();

		game.armies.forEach((army) => {
			eventEmitter.once(`gameStarted_${game.id}`, startGameListener.bind(null, army));
			eventEmitter.addListener(`armyAttacked_${army.id}_${game.startedAt}`, attackArmyListener);
		});


		eventEmitter.emit(`gameStarted_${game.id}`, game);
	}

	static resetGame(game) {
		game.armies.forEach((army) => {
			eventEmitter.removeAllListeners(`armyAttacked_${army.id}_${game.startedAt}`);
		});
		console.log('reset');
		this.startGame(game);
	}
}

function startGameListener(armyListener, game) {
	console.log('game with id', game.id, 'started for', armyListener.name, 'units', armyListener.units);
	attack(armyListener, game);
}

function attackArmyListener(underAttackArmy, invadingArmy) {
	if (isAttackSuccessful(invadingArmy.units)) {
		if (underAttackArmy.units > 0 && invadingArmy.units > 0) {
			const damage = Math.floor(invadingArmy.units * 0.5);
			if (damage > underAttackArmy.units) {
				underAttackArmy.units = 0;
			} else {
				underAttackArmy.units -= damage;
			}
			console.log('invadingArmy', invadingArmy.name, 'underAttackArmy', underAttackArmy.name, 'units', underAttackArmy.units);
		}
	} else {
		console.log('invadingArmy', invadingArmy.name, 'unsuccessful attack');
	}
}

function attack(invadingArmy, game) {
	const fileredArmies = game.armies.filter((army) => (army.id !== invadingArmy.id && army.units !== 0));
	if (fileredArmies.length > 0) {
		if (invadingArmy.units > 0) {
			const underAttackArmy = selectArmyToAttack(game, invadingArmy, fileredArmies);
			const reloadTime = 10 * invadingArmy.units;
			setTimeout(() => {
				eventEmitter.emit(`armyAttacked_${underAttackArmy.id}_${game.startedAt}`, underAttackArmy, invadingArmy);
				attack(invadingArmy, game);
			}, reloadTime);
		}
	} else {
		game.armies.forEach((army) => {
			eventEmitter.removeListener(`armyAttacked_${army.id}_${game.startedAt}`, attackArmyListener);
		});
		console.log(eventEmitter.eventNames());
		// game.status = 'close';
		// game.save();
		console.log(game);
	}
}

function selectArmyToAttack(game, invadingArmy, fileredArmies) {
	let underAttackArmy = null;

	switch (invadingArmy.attackStrategy) {
	case 'random':
		underAttackArmy = fileredArmies[getRandomInt(fileredArmies.length - 1, 0)];
		break;
	case 'weakest':
		underAttackArmy = hasMin(fileredArmies, 'units');
		break;
	case 'strongest':
		underAttackArmy = hasMax(fileredArmies, 'units');
		break;
	default:
		break;
	}

	return underAttackArmy;
}

function getRandomInt(max, min) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasMin(array, attrib) {
	return (array.length && array.reduce((prev, curr) => { 
		return prev[attrib] < curr[attrib] ? prev : curr;
	})) || null;
}

function hasMax(array, attrib) {
	return (array.length && array.reduce((prev, curr) => { 
		return prev[attrib] > curr[attrib] ? prev : curr;
	})) || null;
}

function isAttackSuccessful(units) {
	const randomNumber = getRandomInt(100, 1);
	return randomNumber < units;
}

module.exports = BattleSimulator;
