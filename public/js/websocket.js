const hostname = window.location.hostname;
const protocol = (window.location.protocol === 'https:' ? 'wss' : 'ws');
const url = protocol + '://' + hostname + '/';
let connection = new WebSocket(url);

connection.onmessage = e => {
	let data = JSON.parse(e.data);
	updateCurrentStatus(data.thermostat, data.real_temp, data.state, data.mode);
};

connection.onopen = () => {
	refresh();
};

let refresh = () => {
	try {
		connection.send(JSON.stringify({request: 'refresh'}));
		setTimeout(refresh, 2500);
	} catch (ignore) { }
};

let updateThermostat = newValue => {
	if (isNaN(newValue))
		return;

	newValue = Math.round(newValue);
	newValue = Math.max(newValue, 0);
	newValue = Math.min(newValue, 90);
	updateCurrentStatus(newValue, realTemp, state, control);
	connection.send(JSON.stringify({request: 'thermostat', value: newValue}));
};

let updateControlState = newValue => {
	updateCurrentStatus(thermostat, realTemp, state, newValue);
	connection.send(JSON.stringify({request: 'control_state', value: newValue}));
};