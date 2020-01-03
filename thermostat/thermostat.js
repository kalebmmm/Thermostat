const State = require('./enums/State');
const Mode = require('./enums/Mode');

const getCurrentTemp = require('./currenttemp');
const isHome = require('./home');
const heater = require('./kasa');

let thermostat = 70.;
let state = State.COOLING;
let mode = Mode.AUTOMATIC;

let getThermostat = () => { return thermostat; };
let getState = () => { return state; };
let getMode = () => { return mode; };
let setThermostat = val => { thermostat = val; };
let setMode = val => { mode = val; };

let nextLoop;

/**
 * Main thermostat loop.
 * This determines whether the heater should be turned on or off
 * and will act accordingly at the point in time which it is run.
 */
let loop = () => {
	let heat = shouldHeat();
	heater(heat);

	if (state === State.COOLING && heat) {
		state = State.WARMING;
	} else if (state === State.WARMING && !heat) {
		state = State.COOLING;
	}

	if (nextLoop !== undefined)
		clearTimeout(nextLoop);

	nextLoop = setTimeout(() => {
		nextLoop = undefined;
		loop();
	}, 30 * 1000);
};

/**
 * Determine if the heat should be on or off at this point in time.
 * @returns {boolean} True if heat should be on, false if not
 */
let shouldHeat = () => {
	let temp = getCurrentTemp();

	if (mode === Mode.AUTOMATIC) {
		if (isHome()) {
			if (temp < thermostat) {
				return !(state === State.COOLING && Math.abs(temp - thermostat) < 1.5);
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		if (temp < thermostat) {
			return !(state === State.COOLING && Math.abs(temp - thermostat) < 1.5);
		} else {
			return false;
		}
	}
};

// Delayed start to let some temperature data get in the system first
setTimeout(loop, 30 * 1000);

module.exports = {
	getThermostat,
	getState,
	getMode,
	getCurrentTemp,
	setThermostat,
	setMode,
	loop
};