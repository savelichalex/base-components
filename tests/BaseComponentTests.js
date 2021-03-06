'use strict';

import {BaseComponent} from '../build/base-components.min';
import chai from 'chai';

var should = chai.should;
var expect = chai.expect;

describe('BaseComponent', function () {
	describe('signals and slots', function () {
		it('should have signals', function (done) {
			class TestComponent extends BaseComponent {
				signals() {
					return {
						local: {
							'trigger@test': 'testSignal'
						}
					}
				}
			}

			var test = new TestComponent();

			test._emitter.once('test').then(function (s) {
				expect(s).to.equal('pass');
				done();
			}, function (err) {
				done(err);
			});

			test.emit.testSignal('pass');
		});

		it('should have slots', function (done) {
			class TestComponent extends BaseComponent {
				slots() {
					return {
						local: {
							'on@test': function (s) {
								expect(s).to.equal('pass');
								done();
							}
						}
					}
				}
			}

			var test = new TestComponent();

			test._emitter.trigger('test', 'pass')
		});
	});
});