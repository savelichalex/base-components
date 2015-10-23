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
var babelGenRegExp = /regeneratorRuntime/;

module.exports.isGeneratorFunc = function ( func ) {
    var funcStr = func.toString();
    return ( typeof func === 'function' && ( genRegExp.test( funcStr ) || babelGenRegExp.test( funcStr ) ) );
};