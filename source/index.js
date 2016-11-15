/* @flow */
/* eslint-disable no-use-before-define */
import type {Readable} from 'stream';

const debuglog = require('util').debuglog;
const bundle = require('./bundle');
const bundleVendors = require('./bundle-vendors');
const createBundler = require('./create-bundler');
const createStream = require('./create-stream');
const loadTransforms = require('./load-transforms');

const log = debuglog('transform-browserify');

module.exports = browserifyTransform;

function browserifyTransform(application: Application): Transform {
	const config = application.configuration.transforms.browserify;
	const opts = config.opts || {};
	const cachedResults = {};

	const vendors = config.vendors || [];
	const vendorBundle = bundleVendors(vendors);
	const vendorsKey = [`vendors`, ...vendors].join(':');

	return async file => {
		if (file.path in cachedResults) {
			log(`Hitting cache for ${file.path}`);
			file.buffer = Buffer.concat([
				await cachedResults[vendorsKey],
				await cachedResults[file.path]
			]);
			return file;
		}

		log(`Filling cache for ${file.path}`);

		const transforms = await loadTransforms(config.transforms || {});
		const bundler = createBundler(opts, {transforms, file});

		bundler.add(createStream(file.buffer), {
			file: file.path
		});

		bundler.emit('file', file.path);

		cachedResults[file.path] = bundle(bundler);

		vendors.forEach(vendor => {
			bundler.external(vendor);
		});

		bundler.on('update', () => {
			log(`Received update for ${file.path}`);
			cachedResults[file.path] = bundle(bundler)
				.then(() => {
					bundler.emit('file', file.path);
				});
			log(`Processed update for ${file.path}`);
		});

		bundler.on('log', log);

		cachedResults[vendorsKey] = Buffer.concat([
			await vendorBundle,
			new Buffer(';', 'utf-8')
		]);

		file.buffer = Buffer.concat([
			await cachedResults[vendorsKey],
			await cachedResults[file.path]
		]);

		return file;
	};
}

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

type File = {
	buffer: Buffer;
	path: string;
};

type Application = { // eslint-disable-line no-undef
	configuration: {
		transforms: {
			browserify: TransformBrowserifyOptions;
		}
	};
};

type Transform = (file: File) => Promise<File>; // eslint-disable-line no-undef
