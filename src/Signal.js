function Signal() {}

Signal.on = function( signal ) {
	return 'on@' + signal;
};

Signal.once = function( signal ) {
	return 'once@' + signal;
};

Signal.trigger = function( signal ) {
	return 'trigger@' + signal;
};

Signal.command = function( signal ) {
	return 'command@' + signal;
};

Signal.request = function( signal ) {
	return 'request@' + signal;
};

module.exports = Signal;