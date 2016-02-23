"use strict";

import FastEmitter from 'fastemitter-with-context';
import Promise from 'bluebird';

export default function () {
	var emitter, emitterProxy;

	emitter = new FastEmitter();

	emitterProxy = {

		on: function (event, context) {
			var promise,
				queue = [];
			emitter.on(event, function (data) {
				promise = new Promise(function (resolve) {
					resolve(data);
				});
				queue.forEach(function (obj) {
					promise = promise.bind(this).then(obj.onResolve, obj.onReject);
				}, this)
			}, context);
			return {
				then: function (onResolve, onReject) {
					queue.push({
						onResolve: onResolve,
						onReject: onReject
					});
				}
			}
		},

		trigger: function (event, data) {
			console.log(event, this.name || '');
			emitter.emit(event, data);
		},

		once: function (event, context) {
			return new Promise(function (resolve) {
				emitter.once(event, function (data) {
					resolve(data);
				}, context);
			});
		},

		removeAll: function (type) {
			return emitter.removeAllListeners(type);
		},

		_commandTo: function (event, data) {
			this.trigger(event + ':up', data);
			return this.once(event + ':down');
		},

		_commandFrom: function (event, context) {
			var promise = this.on(event + ':up', context);
			return {
				then: function (onResolve, onReject) {
					promise = promise.then(onResolve, onReject);
					return this;
				},
				end: function () {
					promise.then(function (data) {
						emitterProxy.trigger(event + ':down', data);
					});
				}
			};
		},

		_commands: {},

		commandTo: function (event, data) {
			if (!this._commands[event]) {
				this._commands[event] = {
					id: 0
				};
			}
			var id = this._commands[event].id;
			this.trigger(event + ':uniqueBefore', this._commands[event].id++);
			var self = this,
				queue = [];
			emitterProxy
				.once(event + ':uniqueAfter')
				.then(function () {
					var promise = self._commandTo(event + ':' + id++, data);
					queue.forEach(function (obj) {
						promise = promise.then(obj.onResolve, obj.onReject);
					});
				});
			return {
				then: function (onResolve, onReject) {
					queue.push({
						onResolve: onResolve,
						onReject: onReject
					});
				}
			}
		},

		commandFrom: function (event, context) {
			var queue = [];
			this.on(event + ':uniqueBefore', context)
				.then(function (id) {
					var promise = emitterProxy.once(event + ':' + id + ':up', context);
					emitterProxy.trigger(event + ':uniqueAfter');
					queue.forEach(function (obj) {
						promise = promise.bind(context).then(obj.onResolve, obj.onReject);
					});
					promise.then(function (data) {
						emitterProxy.trigger(event + ':' + id + ':down', data);
					});
				});
			return {
				then: function (onResolve, onReject) {
					queue.push({
						onResolve: onResolve,
						onReject: onReject
					});
					return this;
				}
			};
		},

		Promise: Promise,

		emitter: emitter
	};

	return emitterProxy;
};