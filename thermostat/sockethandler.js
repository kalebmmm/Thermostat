const Thermostat = require('./thermostat');
let nextLoop;

/**
 * Create the websocket logic
 * @param socket The websocket which logic should be added to
 */
const setupSocket = socket => {
	socket.on('connection', (ws) => {
		ws.on('message', message => {
			let req = JSON.parse(message);

			if (req.request === 'refresh') {
				refresh(ws);
			} else if (req.request === 'thermostat') {
				Thermostat.setThermostat(req.value);
				socketUpdated();
				refresh(ws);
			} else if (req.request === 'control_state') {
				Thermostat.setMode(req.value);
				socketUpdated();
				refresh(ws);
			}
		});
	});
};

/**
 * Logic for when data is updated from the websocket connection.
 * This ensures the thermostat is updated a maximum of one time
 * per second
 */
const socketUpdated = () => {
	if (nextLoop !== undefined)
		clearTimeout(nextLoop);

	nextLoop = setTimeout(() => {
		Thermostat.loop();
		nextLoop = undefined;
	}, 1000);
};

/**
 * Send current thermostat data to a websocket client
 * @param ws Websocket client
 */
const refresh = (ws) => {
	ws.send(JSON.stringify({
		thermostat: Thermostat.getThermostat(),
		real_temp: Math.round(Thermostat.getCurrentTemp()),
		state: Thermostat.getState(),
		mode: Thermostat.getMode()
	}));
};

module.exports = setupSocket;