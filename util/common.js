class Common {
	/**
	 * Return random number between min and max
	 *
	 * @param {Number} max
	 * @param {Number} min
	 * @returns {Number}
	 */
	static getRandomInt(max, min) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Compare array of objects on specific object property to get object with minimum value
	 *
	 * @param {Array} array
	 * @param {String} attrib
	 * @returns {Object}
	 */
	static getMin(array, attrib) {
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
	static getMax(array, attrib) {
		return (array.length && array.reduce((prev, curr) => { 
			return prev[attrib] > curr[attrib] ? prev : curr;
		})) || null;
	}
}

module.exports = Common;
