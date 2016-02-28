"use strict";

import Emitter from './Emitter';

import { EventStream as es } from 'event-streams';

const GlobalEmitter = Emitter();
GlobalEmitter.name = 'global';

/**
 * Base class to create component.
 * Create signals and slots.
 * For use it you must extend it
 */
export class BaseComponent {
	constructor(emitter) {
		this._emitter = emitter || GlobalEmitter;
		//this._emitter.name = this.inheritChain[this.inheritChain.length - 1] + '-local'; //for debugging with
		this._emitter.name = 'local'; //for debugging

		//create container for signals
		// this.emit = {};

		//object to save links to events and channels
		this.__slots = {};
		this.__signals = {};

		//create slots and signals
		if (Object.prototype.toString.call(this.slots) === '[object Function]') {
			this.slots = this.slots();
		}
		this._slots(this.slots); //maybe signals is better for slots? (in frp terms)
		// if (Object.prototype.toString.call(this.signals) === '[object Function]') {
		// 	this.signals = this.signals();
		// }
		// this._signals(this.signals);
	}

	/**
	 * Read slots and create event stream for every entry point
	 * Also main method is calling and subscribe to returned
	 * streams that trigger events
	 * @param {Array} slots
	 * @private
	 */
	_slots(slots) {
		const streams = slots.reduce((prev, slot) => {
			const stream = es.EventStream();

			this.__slots[slot] = stream;

			this._emitter.on(slot).then(val => es.push(stream, val));

			prev.push(stream);
			return prev;
		}, []);

		const output = this.main.apply(this, streams);

		Object.keys(output).forEach(key => {
			const stream = output[key];

			es.subscribe(
				stream,
				val => this._emitter.trigger(key, val),
				err => console.warn(err)
			);
		});
	}

	// /**
	//  * Method to create slots
	//  * @param channels {Object}
	//  * @private
	//  */
	// _slots(channels) {
	// 	for (var channel in channels) {
	// 		if (channels.hasOwnProperty(channel)) {
	//
	// 			var slots = channels[channel];
	//
	// 			if (typeof slots === 'function') {
	// 				slots = slots.call(this);
	// 			}
	//
	// 			if (Object.prototype.toString.call(slots) !== '[object Object]') {
	// 				throw new Error("Slots must be (or return from func) hash object");
	// 			}
	//
	// 			var emitter = channel === 'global' ? this._globalEmitter : this._emitter;
	//
	// 			for (var slot in slots) {
	// 				if (slots.hasOwnProperty(slot)) {
	// 					var _arr = slot.split('@');
	// 					if (_arr.length > 2) {
	// 						throw new Error("Incorrect name of slot");
	// 					}
	// 					var method = _arr[0];
	// 					var event = _arr[1];
	//
	// 					this.__slots[event] = {
	// 						emitter: emitter,
	// 						method: method,
	// 						channel: void 0
	// 					};
	//
	// 					var promise;
	//
	// 					switch (method) {
	// 						case 'on':
	// 							promise = emitter.on(event, this);
	// 							break;
	// 						case 'once':
	// 							promise = emitter.once(event, this);
	// 							break;
	// 						case 'command':
	// 							promise = emitter.commandFrom(event, this);
	// 							break;
	// 					}
	//
	// 					if (Object.prototype.toString.call(slots[slot]) === '[object Function]') {
	// 						slots[slot] = defer(slots[slot]);
	// 					}
	//
	// 					slots[slot]._queue.forEach(function (cb) {
	// 						promise = promise.then(cb.onFulfill, cb.onReject);
	// 					});
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	// /**
	//  * Method to create signals
	//  * @param channels
	//  * @private
	//  */
	// _signals(channels) {
	// 	for (var channel in channels) {
	// 		if (channels.hasOwnProperty(channel)) {
	//
	// 			var signals = channels[channel];
	//
	// 			if (typeof signals === 'function') {
	// 				signals = signals.call({});
	// 			}
	//
	// 			if (Object.prototype.toString.call(signals) !== '[object Object]') {
	// 				throw new Error("Signals must be (or return from func) hash object");
	// 			}
	//
	// 			var emitter = channel === 'global' ? this._globalEmitter : this._emitter;
	//
	// 			for (var signal in signals) {
	// 				if (signals.hasOwnProperty(signal)) {
	// 					var _arr = signal.split('@');
	// 					if (_arr.length > 2) {
	// 						throw new Error("Incorrect name of signal");
	// 					}
	//
	// 					var method = _arr[0];
	// 					var event = _arr[1];
	//
	// 					this.__signals[event] = {
	// 						method: method
	// 					};
	//
	// 					this.emit[signals[signal]] = (function (event, method, emitter) {
	// 						return function (data, obj) {
	// 							var _event;
	// 							if (obj) {
	// 								_event = event.replace(/\{([^\}]+)\}/g, function (i, f) {
	// 									return obj[f];
	// 								});
	// 							} else {
	// 								_event = event;
	// 							}
	//
	// 							switch (method) {
	// 								case 'trigger':
	// 									emitter.trigger(_event, data);
	// 									break;
	// 								case 'command':
	// 									return emitter.commandTo(_event, data);
	// 									break;
	// 							}
	// 						}
	// 					})(event, method, emitter);
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	/**
	 * Method to unsubscribe all events and to close channels
	 */
	destroy() {
		Object.keys(this.__slots).forEach((event) => {
			this.emitter.removeAll(event);
		});
	}
}