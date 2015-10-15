var Emitter = require( '../index' ).Emitter();

var chai = require( 'chai' );
var expect = chai.expect;

var csp = require( 'js-csp' );

describe( 'Commands through csp', function () {
    it( 'should create new channel and send it', function ( done ) {
        Emitter.commandFrom( 'testEvent', function* ( ch, data ) {
            expect( ch ).to.exist;
            expect( data ).to.exist;
            yield csp.put( ch, data );
        } );

        csp.go(function* () {
            var testData = 'test data';
            var val = yield Emitter.commandTo( 'testEvent', testData );
            expect( val ).to.exist;
            expect( val ).to.be.equal( testData );
            done();
        });
    } );
} );