/* eslint-disable no-use-before-define */
/* @flow */
import type {Readable} from 'stream';

const browserify = require('browserify');
const intoStream = require('into-stream');
const values = require('lodash/values');

const createResolver = require('./create-resolver');
const getDependencyRegistry = require('./get-dependency-registry');

module.exports = createBundler;

function createBundler(options: BrowserifyOptions, context: BundleContext): Bundler {
	const dependencies = getDependencyRegistry(context.file);
	const cache = getCache(context.file);
	const bundler = browserify(options);

	bundler._bresolve = createResolver(dependencies);
	const original = bundler._mdeps.readFile.bind(bundler._mdeps);

	const readFile = (file, id, pkg) => {
		if (file in cache) {
			return cache[file];
		}
		if (file.includes('node_modules')) {
			return original(file, id, pkg);
		}
		throw new Error(`Could not resolve ${file} as ${id} from ${context.file.path}`);
	};

	bundler._mdeps.readFile = readFile.bind(bundler._mdeps);

	context.transforms.forEach(transform => {
		const {fn, opts} = transform;
		if (typeof fn.configure === 'function') {
			bundler.transform(fn.configure(opts));
		} else {
			bundler.transform(fn, opts);
		}
	});

	return bundler;
}

function getCache(file, seed = {}) {
	return values(file.dependencies || {})
		.reduce((cache, dependency) => {
			if (dependency.path in cache) {
				return cache;
			}

			const source = dependency.buffer.length ? dependency.buffer : '/*beep. boop.*/';
			cache[dependency.path] = intoStream(source);
			return getCache(dependency, cache);
		}, seed);
}

type File = {
	buffer: Buffer;
	path: string;
};

type FileCache = {
	[path: string]: Buffer;
};

type BrowserifyEntry = Readable;

type BrowserifyOptions = { // eslint-disable-line no-undef
	cache?: {};
	fileCache?: FileCache;
	packageCache?: {};
	plugin?: Array<Function>;
	require?: Array<BrowserifyEntry>;
};

type BrowserifyTransform = {
	fn: Function;
	name: string;
	opts: Object;
};

type BundleContext = { // eslint-disable-line no-undef
	file: File;
	transforms: Array<BrowserifyTransform>
};

type Bundler = { // eslint-disable-line no-undef
	add: (entry: Readable) => void;
	bundle: (callback: (error: Error|null, result: Buffer) => void) => void;
	external: (id: string) => void;
	on: (eventName: string, callback: () => void) => void;
	emit: (eventName: string) => void;
};
