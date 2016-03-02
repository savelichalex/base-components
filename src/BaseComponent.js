"use strict";

import FastEmitter from 'fastemitter';

import es from 'event-streams';

const GlobalEmitter = new FastEmitter();
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

		//object to save links to events and channels
		this.__slots = {};

		//create slots and signals
		if (Object.prototype.toString.call(this.slots) === '[object Function]') {
			this.slots = this.slots();
		}
		this._slots(this.slots); //maybe signals is better for slots? (in frp terms)
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

			this._emitter.on(slot, val => es.push(stream, val));

			prev.push(stream);
			return prev;
		}, []);

		const output = this.main.apply(this, streams);

		Object.keys(output).forEach(key => {
			const stream = output[key];

			es.subscribe(
				stream,
				val => this._emitter.emit(key, val),
				err => console.warn(err)
			);
		});
	}

	/**
	 * Method to unsubscribe all events and to close channels
	 */
	destroy() {
		Object.keys(this.__slots).forEach((event) => {
			this.emitter.removeAll(event);
		});
	}
}