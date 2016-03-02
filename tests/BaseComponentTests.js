'use strict';

import { expect } from 'chai';
import { BaseComponent } from '../src/BaseComponent';
import es from 'event-streams';

describe('BaseComponent', function() {
	describe('signals and slots', function() {
		it('should have slots', function(done) {
			class TestComponent extends BaseComponent {
				slots() {
					return [
						'test'
					]
				}

				main(test$) {
					es.subscribe(
						test$,
						val => {
							expect(val).to.equal('work');
							done();
						}
					);

					return {};
				}
			}

			const test = new TestComponent();

			test._emitter.emit('test', 'work');
		});
	});
});