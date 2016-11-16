/* eslint-disable no-use-before-define */
/* @flow */
import type {Readable} from 'stream';

const browserify = require('browserify');
const values = require('lodash/values');

const createResolver = require('./create-resolver');
const getDependencyRegistry = require('./get-dependency-registry');

module.exports = createBundler;

function createBundler(options: BrowserifyOptions, context: BundleContext): Bundler {
	options.fileCache = values(context.file.dependencies || {})
		.reduce((fileCache, dependency) => {
			fileCache[dependency.path] = dependency.buffer || '// beep. boop';
			return fileCache;
		}, {});

	options.cache = {};
	options.packageCache = {};

	const dependencies = getDependencyRegistry(context.file);
	const bundler = browserify(options);

	// PR for browserify allowing to override mopt.resolve
	// https://github.com/substack/node-browserify/blob/7fbaee2d1373f5f186bab98d80dbffaccd058d92/index.js#L460
	bundler._bresolve = createResolver(dependencies);

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
