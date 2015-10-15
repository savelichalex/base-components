"use strict";

module.exports.defer = function ( onFulfill, onReject ) {
    return {
        _queue: [{
            onFulfill: onFulfill,
            onReject: onReject
        }],
        then: function(onFulfill, onReject) {
            this._queue.push({
                onFulfill: onFulfill,
                onReject: onReject
            });

            return this;
        }
    }
};

var genRegExp = /^function[\s]*\*/;

module.exports.isGeneratorFunc = function ( func ) {
    return ( typeof func === 'function' && genRegExp.test( func.toString() ) );
};