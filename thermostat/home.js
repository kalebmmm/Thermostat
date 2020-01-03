const exec = require("child_process").exec;
const MAC_ADDRESS = 'F4:06:16:76:EA:94';

let lastSeen = -1;

/**
 * Refresh the last seen time of the configured device.
 * This method pings the bluetooth MAC address one time
 * and checks for a successful reply.
 * Requirements: l2ping, grep
 */
let refresh = () => {
	exec('sudo l2ping ' + MAC_ADDRESS + ' -c 1 -t 5 | grep "1 sent, 1 received"', (error, stdout, stderr) => {
		if (stdout !== '')
			lastSeen = new Date().getTime();
	});

	setTimeout(refresh, 1000 * 50);
};

refresh();

module.exports = () => {
	let threshold = new Date().getTime() - (1000 * 60 * 5);
	return lastSeen > threshold;
};
