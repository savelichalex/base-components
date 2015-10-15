var FastEmitter = require( 'fastemitter-with-context' );
var Promise = require( 'bluebird' );
var csp = require( 'js-csp' );

"use strict";

module.exports = function () {
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
                var self = this;
                queue.forEach(function (obj) {
                    promise = promise.bind(self).then(obj.onResolve, obj.onReject);
                })
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

        off: function (event) {
            emitter.off(event);
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

        commandTo: function (event, data) {
            var commandChannel = csp.chan(csp.buffers.fixed(1));

            this.trigger( event, [commandChannel, data] );

            return commandChannel;
        },

        commandFrom: function (event, gen, context) {
            this.on( event, context ).then( function ( chAndData ) {
                csp.go( gen, chAndData );
            } );
        },

        Promise: Promise,
    };

    return emitterProxy;
};