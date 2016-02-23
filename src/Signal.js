'use strict';

export class Signal {
	static on(signal) {
		return 'on@' + signal;
	}

	static once(signal) {
		return 'once@' + signal;
	}

	static trigger(signal) {
		return 'trigger@' + signal;
	}

	static command(signal) {
		return 'command@' + signal;
	}

	static request(signal) {
		return 'request@' + signal;
	}
}