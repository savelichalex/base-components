var BaseComponent = require( '../index' ).BaseComponent;
var chai = require( 'chai' );
require( 'base-extends' );
var csp = require( 'js-csp' );

var assert = chai.assert;
var should = chai.should;
var expect = chai.expect;

describe('BaseComponent', function () {
    "use strict";

    describe( 'inherit and init', function () {
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
    } );

    describe( 'signals and slots', function () {
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

        it( 'should do request', function ( done ) {
            "use strict";

            var testData = 'test data';

            class TestComponent1 extends BaseComponent {
                constructor() {
                    super();
                }

                signals() {
                    return {
                        global: {
                            'request@testCommand': 'testCommand'
                        },
                        local: {
                            'trigger@startTest': 'startTest'
                        }
                    }
                }

                slots() {
                    return {
                        local: {
                            'on@startTest': function* ( ch ) {
                                expect( ch ).to.exist;
                                var data;
                                var i = 0;

                                while( i < 3 && ( ( data = yield ch ) !== csp.CLOSED ) ) {
                                    expect( data ).to.exist;
                                    expect( data ).to.be.equal( testData );
                                    var val = yield this.emit.testCommand( data );
                                    expect( val ).to.exist;
                                    expect( val ).to.be.equal( testData + ' command' );
                                    i = i + 1;
                                }
                                done();
                            }
                        }
                    }
                }
            }

            class TestComponent2 extends BaseComponent {
                constructor() {
                    super();
                }

                slots() {
                    return {
                        global: {
                            'request@testCommand': function* ( ch, data ) {
                                expect( ch ).to.exist;
                                expect( data ).to.exist;
                                expect( data ).to.be.equal( testData );
                                yield csp.put( ch, data + ' command' );
                            }
                        }
                    }
                }
            }

            var tc1 = new TestComponent1();
            var tc2 = new TestComponent2();

            tc1.emit.startTest( testData );
            tc1.emit.startTest( testData );
            tc1.emit.startTest( testData );
        } );
    } );
});