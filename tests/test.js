import assert from 'assert';
import { BaseComponent } from '../index';

describe('BaseComponent', function () {
    it('should be instanceOf', function () {
        var TestComponent = new BaseComponent();

        assert.ok( TestComponent instanceof BaseComponent, 'TestComponent is an instance of BaseComponent' );
    });

    it('should be inherited by es6 class', function () {
        class TestComponent extends BaseComponent {
            constructor() {
                super();
            }
        }

        var test = new TestComponent();

        assert.ok( test instanceof BaseComponent, 'TestComponent is an instance of BaseComponent' );
    });

    //it('should have signals by es6 class', function () {
    //    class TestComponent extends BaseComponent {
    //        constructor() {
    //            super();
    //        }
    //
    //        static signals() {
    //            return {
    //                local: {
    //                    'trigger@test': 'testSignal'
    //                }
    //            }
    //        }
    //    }
    //
    //    var test = new TestComponent();
    //
    //    console.log( test._emitter );
    //
    //    test._emitter.once( 'test' ).should.equal('pass');
    //
    //    test.emit.testSignal('pass');
    //});
});