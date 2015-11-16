var Emitter = require( '../index' ).Emitter();

var chai = require( 'chai' );
var expect = chai.expect;

//describe( 'Request through csp', function () {
//    it( 'should create new channel and send it', function ( done ) {
//        Emitter.requestFrom( 'testEvent', function* ( ch, data ) {
//            expect( ch ).to.exist;
//            expect( data ).to.exist;
//            yield csp.put( ch, data );
//        } );
//
//        csp.go(function* () {
//            var testData = 'test data';
//            var val = yield Emitter.requestTo( 'testEvent', testData );
//            expect( val ).to.exist;
//            expect( val ).to.be.equal( testData );
//            done();
//        });
//    } );
//} );