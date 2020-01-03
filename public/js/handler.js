const Control = Object.freeze({
	AUTOMATIC: 'Automatic Control',
	MANUAL: 'Manual Control'
});

const State = Object.freeze({
	WARMING: 'Warming',
	COOLING: 'Cooling'
});

let thermostat = '--';
let realTemp = '--';
let state = State.WARMING;
let control = Control.MANUAL;

$(document).ready(() => {
	updateCurrentStatus(thermostat, realTemp, state, control);
	$('.thermostat').height($(window).height() * .85);
	$('.infobar').height($(window).height() * .15);
});

$(window).resize(() => {
	$('.thermostat').height($(window).height() * .85);
	$('.infobar').height($(window).height() * .15);
});

$('#temp-up').click(() => {
	if (isNaN(thermostat))
		return;
	updateThermostat(++thermostat);
});

$('#temp-down').click(() => {
	if (isNaN(thermostat))
		return;
	updateThermostat(--thermostat);
});

$('.infobar').click(() => {
	control = control === Control.AUTOMATIC ? Control.MANUAL : Control.AUTOMATIC;
	updateControlState(control);
});

const updateCurrentStatus = (currentThermostat, currentTemp, currentState, currentControl) => {
	thermostat = currentThermostat;
	realTemp = currentTemp;
	state = currentState;
	control = currentControl;

	$('#thermostat-temp').text(currentThermostat + '°');
	$('#home-away').text(currentControl + ' - ' + currentTemp + '°');
	updateBackground();
};

const updateBackground = () => {
	if (state === State.COOLING) {
		$('body').css('background', 'linear-gradient(0deg, rgba(40,119,187,1) 0%, rgba(32,237,228,1) 100%)');
	} else {
		$('body').css('background', 'linear-gradient(0deg, rgba(187,57,40,1) 0%, rgba(237,100,32,1) 100%)');
	}
};