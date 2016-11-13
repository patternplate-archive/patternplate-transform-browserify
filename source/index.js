/* @flow */
import type {Readable} from 'stream';

const md5 = require('md5');

const bundle = require('./bundle');
const bundleVendors = require('./bundle-vendors');
const createBundler = require('./create-bundler');
const createStream = require('./create-stream');
const loadTransforms = require('./load-transforms');

module.exports = browserifyTransform;

function browserifyTransform(application: Application): Transform {
	const config = application.configuration.transforms.browserify;
	const opts = config.opts || {};
	const bundlers = {};
	const cachedResults = {};

	const vendors = config.vendors || [];
	const vendorBundle = bundleVendors(vendors);
	const vendorsKey = [`vendors`, ...vendors].join(':');

	return async file => {
		const hash = md5(file.buffer.toString('utf-8'));

		if (hash in cachedResults) {
			file.buffer = Buffer.concat([
				cachedResults[vendorsKey],
				await cachedResults[hash]
			]);
			return file;
		}

		if (hash in bundlers) {
			file.buffer = Buffer.concat([
				cachedResults[vendorsKey],
				await bundle(bundlers[hash])
			]);
			return file;
		}

		const transforms = await loadTransforms(config.transforms || {});
		const bundler = createBundler(opts, {transforms, file, bundlers});

		bundler.add(createStream(file.buffer), {
			file: file.path
		});

		vendors.forEach(vendor => {
			bundler.external(vendor);
		});

		bundler.on('update', () => {
			cachedResults[hash] = bundle(bundler);
		});

		cachedResults[hash] = await bundle(bundler);
		cachedResults[vendorsKey] = Buffer.concat([
			await vendorBundle,
			new Buffer(';', 'utf-8')
		]);

		file.buffer = Buffer.concat([
			cachedResults[vendorsKey],
			cachedResults[hash]
		]);

		return file;
	};
};

type BrowserifyEntry = Readable;

type FileCache = {
	[path: string]: Buffer;
};

type BrowserifyOptions = {
	cache?: {};
	fileCache?: FileCache;
	packageCache?: {};
	plugin?: Array<Function>;
	require?: Array<BrowserifyEntry>;
};

type TransformBrowserifyOptions = {
	opts?: BrowserifyOptions;
	transforms?: {[transformName: string]: Object};
	vendors?: Array<string>;
};

type Application = {
	configuration: {
		transforms: {
			browserify: TransformBrowserifyOptions;
		}
	};
};

type File = {
	buffer: Buffer;
	path: string;
};

type Transform = (file: File) => Promise<File>;
