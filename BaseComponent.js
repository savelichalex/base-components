var Emitter = require( './Emitter.js' );
var csp = require( 'js-csp' );

var defer = require( './util' ).defer;
var isGenFunc = require( './util' ).isGeneratorFunc;

"use strict";

var GlobalEmitter = Emitter();
GlobalEmitter.name = 'global';

/**
 * Base class to create component.
 * Create signals and slots.
 * For use it you must extend it.
 * @constructor
 */
function BaseComponent () {
    //create local instance of emitter
    this._emitter = Emitter();
    //this._emitter.name = this.inheritChain[this.inheritChain.length - 1] + '-local'; //for debugging with
    // base-frame-extends base-frame-extends
    this._emitter.name = 'local'; //for debugging

    //create container for signals
    this.emit = {};

    //create slots and signals
    if( Object.prototype.toString.call( this.slots ) === '[object Function]' ) {
        this.slots = this.slots();
    }
    this._slots( this.slots );
    if( Object.prototype.toString.call( this.signals ) === '[object Function]' ) {
        this.signals = this.signals();
    }
    this._signals( this.signals );
}

BaseComponent.prototype = {
    constructor: BaseComponent,

    /**
     * Method to create slots
     * @param channels {Object}
     * @private
     */
    _slots: function ( channels ) {
        for ( var channel in channels ) {
            if ( channels.hasOwnProperty( channel ) ) {

                var slots = channels[ channel ];

                if ( typeof slots === 'function' ) {
                    slots = slots.call( {} );
                }

                if ( Object.prototype.toString.call( slots ) !== '[object Object]' ) {
                    throw new Error( "Slots must be (or return from func) hash object" );
                }

                var emitter = channel === 'global' ? GlobalEmitter : this._emitter;

                for ( var slot in slots ) {
                    if ( slots.hasOwnProperty( slot ) ) {
                        var _arr = slot.split( '@' );
                        if ( _arr.length > 2 ) {
                            throw new Error( "Incorrect name of slot" );
                        }
                        var method = _arr[ 0 ];
                        var event = _arr[ 1 ];

                        var promise;

                        switch ( method ) {
                            case 'on':
                                promise = emitter.on( event, this );
                                break;
                            case 'once':
                                promise = emitter.once( event, this );
                                break;
                            case 'command':
                                promise = emitter.commandFrom( event, this );
                                break;
                            case 'request':
                                if( !isGenFunc( slots[ slot ] ) ) {
                                    throw new Error( 'If you want to use command then function must be a generator!' );
                                }
                                emitter.requestFrom( event, slots[ slot ], this );
                                break;
                        }

                        if ( Object.prototype.toString.call( slots[ slot ] ) === '[object Function]' ) {
                            if( !isGenFunc( slots[ slot ] ) ) {
                                slots[ slot ] = defer( slots[ slot ] );
                            } else {
                                if( promise ) {
                                    var ch = csp.chan();

                                    var gen = slots[ slot ].call( this, ch );

                                    promise.then( function ( value ) {
                                        csp.putAsync( ch, value );
                                    } );

                                    return csp.spawn( gen, slots[ slot ] );
                                } else {
                                    return;
                                }
                            }
                        }

                        slots[ slot ]._queue.forEach( function ( cb ) {
                            promise = promise.then( cb.onFulfill, cb.onReject );
                        } );
                    }
                }
            }
        }
    },

    /**
     * Method to create signals
     * @param channels
     * @private
     */
    _signals: function ( channels ) {
        for ( var channel in channels ) {
            if ( channels.hasOwnProperty( channel ) ) {

                var signals = channels[ channel ];

                if ( typeof signals === 'function' ) {
                    signals = signals.call( {} );
                }

                if ( Object.prototype.toString.call( signals ) !== '[object Object]' ) {
                    throw new Error( "Signals must be (or return from func) hash object" );
                }

                var emitter = channel === 'global' ? GlobalEmitter : this._emitter;

                for ( var signal in signals ) {
                    if ( signals.hasOwnProperty( signal ) ) {
                        var _arr = signal.split( '@' );
                        if ( _arr.length > 2 ) {
                            throw new Error( "Incorrect name of signal" );
                        }

                        var method = _arr[ 0 ];
                        var event = _arr[ 1 ];

                        this.emit[ signals[ signal ] ] = (function( event, method, emitter ) {
                            return function ( data, obj ) {
                                var _event;
                                if( obj ) {
                                    _event = event.replace( /\{([^\}]+)\}/g, function ( i, f ) {
                                        return obj[ f ];
                                    } );
                                } else {
                                    _event = event;
                                }

                                switch( method ) {
                                    case 'trigger':
                                        emitter.trigger( _event, data );
                                        break;
                                    case 'command':
                                        return emitter.commandTo( _event, data );
                                        break;
                                    case 'request':
                                        return emitter.requestTo( _event, data );
                                        break;
                                }
                            }
                        })( event, method, emitter );
                    }
                }
            }
        }
    }

};

module.exports = BaseComponent;