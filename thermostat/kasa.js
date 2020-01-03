const { Client } = require('tplink-smarthome-api');

/**
 * Method to turn on or off the kasa smart plug
 * with the heater plugged into it.
 * @param on True for on, false for off
 */
module.exports = on => {
	// Create a new kasa client and start discovery on the network's subnet.
	// Search is by MAC address and will update if and when the device is found.
	const client = new Client();
	client.startDiscovery({broadcast:"192.168.0.255"}).on('device-new', (device) => {
		device.getSysInfo().then(info => {
			if (info.mac === 'B0:4E:26:15:E8:7E')
				device.setPowerState(on);

			client.stopDiscovery();
		});
	});
};