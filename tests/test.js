var BaseComponent = require( '../index' ).BaseComponent;
var chai = require( 'chai' );
require( 'base-extends' );

var assert = chai.assert;
var should = chai.should;
var expect = chai.expect;

describe('BaseComponent', function () {
    "use strict";

    it('should be instanceOf', function () {
        var TestComponent = new BaseComponent();

        assert.instanceOf( TestComponent, BaseComponent, 'TestComponent is an instance of BaseComponent' );
    });

    it('should be inherited by es6 class', function () {
        "use strict";

        class TestComponent extends BaseComponent {
            constructor() {
                super();
            }
        }

        var test = new TestComponent();

        assert.instanceOf( test, BaseComponent, 'TestComponent is extend BaseComponent' );
    });

    it( 'should have signals by es6 class', function ( done ) {
        "use strict";

        class TestComponent extends BaseComponent {
            constructor () {
                super();
            }

            signals () {
                return {
                    local: {
                        'trigger@test': 'testSignal'
                    }
                }
            }
        }

        var test = new TestComponent();

        test._emitter.once( 'test' ).then( function ( s ) {
            expect( s ).to.equal( 'pass' );
            done();
        }, function ( err ) {
            done( err );
        } );

        test.emit.testSignal( 'pass' );
    } );

    it( 'should have slots by es6 class', function ( done ) {
        "use strict";

        class TestComponent extends BaseComponent {
            constructor () {
                super();
            }

            slots () {
                return {
                    local: {
                        'on@test': function ( s ) {
                            expect( s ).to.equal( 'pass' );
                            done();
                        }
                    }
                }
            }
        }

        var test = new TestComponent();

        test._emitter.trigger( 'test', 'pass' )
    } );

    it( 'should have signals by base-frame-extends', function ( done ) {
        "use strict";

        function TestComponent () {
            this.super();
        }

        TestComponent.prototype = {
            signals: {
                local: {
                    'trigger@test': 'testSignal'
                }
            }
        };

        TestComponent.extends( BaseComponent );

        var test = new TestComponent();

        test._emitter.once( 'test' ).then( function ( s ) {
            expect( s ).to.equal( 'pass' );
            done();
        }, function ( err ) {
            done( err );
        } );

        test.emit.testSignal( 'pass' );
    } );

    it( 'should have slots by base-frame-extends', function ( done ) {
        "use strict";

        function TestComponent () {
            this.super();
        }

        TestComponent.prototype = {
            slots: {
                local: {
                    'on@test': function ( s ) {
                        expect( s ).to.equal( 'pass' );
                        done();
                    }
                }
            }
        };

        TestComponent.extends( BaseComponent );

        var test = new TestComponent();

        test._emitter.trigger( 'test', 'pass' )
    } );
});