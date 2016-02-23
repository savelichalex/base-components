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

//var GFP = Object.getPrototypeOf(function*(){});
//if( !( Symbol.toStringTag in GFP ) ) {
//	GFP[Symbol.toStringTag] = 'GeneratorFunction';
//}
//
//console.log({}.toString.call(function*(){}));

var genRegExp = /^function[\s]*\*/;
var babelGenRegExp = /regeneratorRuntime/;

module.exports.isGeneratorFunc = function ( func ) {
    return ( typeof func === 'function' && ( genRegExp.test( func.toString() ) || babelGenRegExp.test( func.toString() ) ) );
};