/* @flow */
/* eslint-disable import/default */
import test from 'ava';
import factory from '../source';
import * as mocks from './mocks';
import {createFakeDir, createFakeModule, createLinkedFakeModule, cleanUpFakes} from './fakes';

test.before('create fake directory', () => {
	createFakeDir();
});

test.after.always('clean up fakes', () => {
	cleanUpFakes();
});

test('it should export a function as default', t => {
	const actual = typeof factory;
	const expected = 'function';
	t.deepEqual(actual, expected);
});

test('calling the function should return a function', t => {
	const actual = typeof factory(mocks.application);
	const expected = 'function';
	t.deepEqual(actual, expected);
});

test('calling the returned function should return a promise', t => {
	const transform = factory(mocks.application);
	const actual = transform(mocks.emptyFile).constructor.name;
	const expected = 'Promise';
	t.deepEqual(actual, expected);
});

test('the returned promise should resolve to an object', async t => {
	const transform = factory(mocks.application);
	const actual = Object.prototype.toString(await transform(mocks.emptyFile));
	const expected = '[object Object]';
	t.deepEqual(actual, expected);
});

test('the resolved object should have a buffer key', async t => {
	const transform = factory(mocks.application);
	const file = await transform(mocks.emptyFile);
	t.truthy(Object.prototype.hasOwnProperty.call(file, 'buffer'));
});

test('the resolved object should have a buffer key for buffer files', async t => {
	const transform = factory(mocks.application);
	const file = await transform(mocks.emptyBufferFile);
	t.truthy(Object.prototype.hasOwnProperty.call(file, 'buffer'));
});

test('load module dependencies', async () => {
	createFakeModule();
	const transform = factory(mocks.application);
	await transform(mocks.fileWithModuleDeps);
});

test('load linked module dependencies', async () => {
	createLinkedFakeModule();
	const transform = factory(mocks.application);
	await transform(mocks.fileWithLinkedModuleDeps);
});
