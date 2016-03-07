'use strict';

const assert = require('assert');
const EventEmitter = require('events');

const logger = new EventEmitter();
require('./..')(warn => logger.emit('warn', warn));

describe('Sugar-Deprecated', function () {
	afterEach(function () {
		logger.removeAllListeners('warn');
	});

	it('should warn on usage of String#at', function (done) {
		logger.once('warn', () => done());
		assert.equal('xyz'.at(1), 'y');
	});

	it('should warn on usage of String#capitalize', function (done) {
		logger.once('warn', () => done());
		assert.equal('lorem ipsum'.capitalize(), 'Lorem ipsum');
	});

	it('should warn on usage of String#escapeHTML', function (done) {
		logger.once('warn', () => done());
		assert.equal('<script class="evil"></script>'.escapeHTML(), '&lt;script class=&quot;evil&quot;&gt;&lt;&#x2f;script&gt;');
	});

	for (let family of ['Arabic', 'Cyrillic', 'Greek', 'Hangul', 'Han', 'Kanji', 'Hebrew', 'Hiragana', 'Kana', 'Katakana', 'Latin', 'Thai', 'Devanagari']) {
		it('should warn on usage of String#has' + family, function (done) {
			logger.once('warn', () => done());
			assert.equal('latin string'['has' + family](), family === 'Latin');
		});
	}

	it('should warn on usage of String#isBlank', function (done) {
		logger.once('warn', () => done());
		assert.equal(' '.isBlank(), true);
	});

	it('should warn on usage of String#padLeft', function (done) {
		logger.once('warn', () => done());
		assert.equal('7'.padLeft(3, '0'), '007');
	});

	it('should warn on usage of String#padRight', function (done) {
		logger.once('warn', () => done());
		assert.equal('1.0'.padRight(5, '0'), '1.000');
	});

	it('should warn on usage of String#pluralize', function (done) {
		logger.once('warn', () => done());
		assert.equal('octopus'.pluralize(), 'octopi');
	});

	it('should warn on usage of String#singularize', function (done) {
		logger.once('warn', () => done());
		assert.equal('strings'.singularize(), 'string');
	});

	it('should warn on usage of String#words', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual('Lorem ipsum dolor sit amet'.words(), ['Lorem', 'ipsum', 'dolor', 'sit', 'amet']);
	});

	it('should warn on usage of Number.range', function (done) {
		logger.once('warn', () => done());
		assert(Number.range(3, 8).contains(7));
	});

	it('should warn on usage of Number#abbr', function (done) {
		logger.once('warn', () => done());
		assert.equal((1500).abbr(1), "1.5k");
	});

	it('should warn on usage of Number#bytes', function (done) {
		logger.once('warn', () => done());
		assert.equal((1000).bytes(), "1kB");
	});

	it('should warn on usage of Number#cap', function (done) {
		logger.once('warn', () => done());
		assert.equal((9999).cap(1023), 1023);
	});

	it('should warn on usage of Number#chr', function (done) {
		logger.once('warn', () => done());
		assert.equal((97).chr(), "a");
	});

	it('should warn on usage of Number#clamp', function (done) {
		logger.once('warn', () => done());
		assert.equal((-1).clamp(0, 10), 0);
	});

	it('should warn on usage of Number#duration', function (done) {
		logger.once('warn', () => done());
		assert.equal((60000).duration(), "1 minute");
	});

	it('should warn on usage of Number#format', function (done) {
		logger.once('warn', () => done());
		assert.equal(Math.PI.format(0), "3");
	});

	it('should warn on usage of Number#hex', function (done) {
		logger.once('warn', () => done());
		assert.equal((32).hex(), "20");
	});

	it('should warn on usage of Number#round', function (done) {
		logger.once('warn', () => done());
		assert(Math.abs(Math.PI.round(5) - 3.14159) < Number.EPSILON);
	});

	it('should warn on usage of Array#compact', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual([1, null, 4, 8, null, 9].compact(), [1, 4, 8, 9]);
	});

	it('should warn on usage of Array#groupBy', function (done) {
		logger.once('warn', () => done());
		const elementOne = {a: 4, b: 5};
		const elementTwo = {a: 4, b: 6};
		const elementThree = {a: 5, b:9};
		assert.deepEqual([elementOne, elementTwo, elementThree].groupBy('a'), {'4': [elementOne, elementTwo], '5': [elementThree]});
	});

	it('should warn on usage of Array#none', function (done) {
		logger.once('warn', () => done());
		assert(['a', 'b', 'c'].none('z'));
	});

	it('should warn on usage of Array#randomize', function (done) {
		logger.once('warn', () => done());
		assert.equal(['a', 'b', 'c'].randomize().length, 3);
	});

	it('should warn on usage of Array#sample', function (done) {
		logger.once('warn', () => done());
		assert.equal(['a'].sample(), 'a');
	});

	it('should warn on usage of Array#subtract', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual(['a', 'b', 'c'].subtract(['a', 'c']), ['b']);
	});

	it('should warn on usage of Object.clone', function (done) {
		logger.once('warn', () => done());
		const original = {a: 5};
		const clone = Object.clone(original);
		assert.deepEqual(original, clone);
	});

	it('should warn on usage of Object.merge', function (done) {
		logger.once('warn', () => done());
		const targetObject = {a: 1, b: 3};
		const sourceObject = {c: 4};
		assert.deepEqual(Object.merge(targetObject, sourceObject), {a: 1, b: 3, c: 4});
	});

	it('should warn on usage of Object.reject', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual(Object.reject({keyOne: 1, keyTwo: 3}, ['keyOne']), {keyTwo: 3});
	});

	it('should warn on usage of Object.select', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual(Object.select({keyOne: 1, keyTwo: 3}, ['keyOne']), {keyOne: 1});
	});

	it('should warn on usage of Object.size', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual(Object.size({keyOne: 1, keyTwo: 3}), 2);
	});

	it('should warn on usage of Object.values', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual(Object.values({a: 1, b: 3}), [1, 3]);
	});

	it('should warn on usage of Function#once', function (done) {
		logger.once('warn', () => done());

		let callCount = 0;
		const fn = function () {
			callCount++;
		}.once();

		fn();
		fn();
		assert.equal(callCount, 1);
	});

	it('should warn on usage of RegExp.escape', function (done) {
		logger.once('warn', () => done());
		assert.equal(RegExp.escape('/path/to/file/'), '\\/path\\/to\\/file\\/');
	});

	it('should warn on non-standard usage of String#startsWith', function (done) {
		logger.once('warn', () => done());
		assert.equal('007'.startsWith(/[0-9]/), true);
	});

	it('should warn on non-standard usage of String#endsWith', function (done) {
		logger.once('warn', () => done());
		assert.equal(' '.endsWith(/\s/), true);
	});

	it('should warn on non-standard usage of Object.keys', function (done) {
		logger.once('warn', () => done());

		let called = false;
		const fn = function () {
			called = true;
		};
		assert.deepEqual(Object.keys({a: 5}, fn), ['a']);
		assert(called);
	});

	it('should warn on non-standard usage of Array#map', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual([{id: 1}].map('id'), [1]);
	});

	it('should warn on non-standard usage of Array#filter', function (done) {
		logger.once('warn', () => done());
		assert.deepEqual([1, 1, 2, 3, 5].filter(1), [1, 1]);
	});

	it('should warn on non-standard usage of Array#every', function (done) {
		logger.once('warn', () => done());
		assert.equal([1, 1].every(1), true);
	});

	it('should warn on non-standard usage of Array#every', function (done) {
		logger.once('warn', () => done());
		assert.equal([1, 1, 2].some(2), true);
	});

	it('should warn on non-standard usage of Array#find', function (done) {
		logger.once('warn', () => done());
		assert.equal([1, 1, 2, 3, 5].find(5), 5);
	});

	it('should warn on non-standard usage of Array#findIndex', function (done) {
		logger.once('warn', () => done());
		assert.equal([1, 1, 2, 3, 5].findIndex(5), 4);
	});
});
