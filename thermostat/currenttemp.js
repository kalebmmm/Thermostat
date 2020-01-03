const exec = require("child_process").exec;
let temp = 70.0;
let temps = [];

/**
 * Get the average temperature from the last given
 * amount of time defined in the config
 * @returns {number} Temperature in fahrenheit
 */
let getTemp = () => {
	return temp;
};

/**
 * Push a new temperature reading
 * @param newTemp Temperature reading
 */
let addTemp = (newTemp) => {
	temps.push({
		timestamp: new Date().getTime(),
		temp: newTemp
	});

	temp = getUpdatedTemperature();
};

/**
 * Calculate the average temp over the
 * time defined in the config, remove
 * old temperature entries, and return
 * the calculated value
 * @returns {number} Average temperature
 */
let getUpdatedTemperature = () => {
	let time = new Date().getTime() - (1000 * 45);
	temps = temps.filter(entry => entry.timestamp > time);

	if (temps.length === 0)
		return 70.0;

	if (temps.length === 1)
		return temps[0].temp;

	return temps.map(a => a.temp).reduce((a,b) => a + b) / temps.length;
};

/**
 * Refresh the temperature from the python script
 * that interfaces with a temperature/humidity sensor
 *
 * This will automatically log the temperature reading
 * or print an error if the sensor could not be read
 *
 * Requirements: python3, Adafruit_DHT from pip3
 */
let refreshTemp = () => {
	exec('python3 get_temp.py', (error, stdout, stderr) => {
		try {
			let currentTemp = parseFloat(stdout);
			currentTemp = (currentTemp * (9./5.)) + 32.; // convert to fahrenheit
			addTemp(currentTemp);
		} catch (e) {
			console.log("Failed to parse temperature: " + data.toString())
		}
	});

	setTimeout(refreshTemp, 7500);
};

refreshTemp();
module.exports = getTemp;