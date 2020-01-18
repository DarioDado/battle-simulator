const events = require('events');

const eventEmitter = new events.EventEmitter();

class BattleSimulator {
	static startGame(game) {
		game.armies.forEach((army) => {
			eventEmitter.once(`gameStarted_${game.id}`, startGameListener.bind(null, army));
			eventEmitter.addListener(`armyAttacked_${army.id}`, attackArmyListener);
		});

		eventEmitter.emit(`gameStarted_${game.id}`, game);
	}

	static resetGame(game) {
		game.armies.forEach((army) => {
			eventEmitter.removeListener(`armyAttacked_${army.id}`, attackArmyListener);
		});
		console.log('reset');
	}
}

function startGameListener(armyListener, game) {
	console.log('game with id', game.id, 'started for', armyListener.name, 'units', armyListener.units);

	attack(armyListener, game);
}

function attackArmyListener(underAttackArmy, invadingArmy) {
	if (underAttackArmy.units > 0 && invadingArmy.units > 0) {
		underAttackArmy.units -= 1;
		console.log('invadingArmy', invadingArmy.name, 'underAttackArmy', underAttackArmy.name, 'units', underAttackArmy.units);
	}
}

function attack(invadingArmy, game) {
	const fileredArmies = game.armies.filter((army) => (army.id !== invadingArmy.id && army.units !== 0));

	if (fileredArmies.length > 0) {
		if (invadingArmy.units > 0) {
			const underAttackArmy = selectArmyToAttack(game, invadingArmy, fileredArmies);
			setTimeout(() => {
				eventEmitter.emit(`armyAttacked_${underAttackArmy.id}`, underAttackArmy, invadingArmy);
				attack(invadingArmy, game);
			}, 100);
		}
	} else {
		game.armies.forEach((army) => {
			eventEmitter.removeListener(`armyAttacked_${army.id}`, attackArmyListener);
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
		underAttackArmy = fileredArmies[getRandomInt(fileredArmies.length - 1)];
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

function getRandomInt(max) {
	const maxNumber = Math.floor(max);
	return Math.floor(Math.random() * (maxNumber - 0 + 1)) + 0;
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

module.exports = BattleSimulator;
