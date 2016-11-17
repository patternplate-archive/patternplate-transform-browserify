/* @flow */
/* eslint-disable no-use-before-define */
import type {Readable} from 'stream';

const memoize = require('lodash').memoize;
const intoStream = require('into-stream');

const bundle = require('./bundle');
const bundleVendors = require('./bundle-vendors');
const createBundler = require('./create-bundler');
const loadTransforms = memoize(require('./load-transforms'));

module.exports = browserifyTransform;

function browserifyTransform(application: Application): Transform {
	const config = application.configuration.transforms.browserify;
	const opts = config.opts || {};

	const vendorsConfig = config.vendors || [];
	const vendorBundling = bundleVendors(vendorsConfig);

	return async file => {
		const transforms = await loadTransforms(config.transforms || {});
		const bundler = createBundler(opts, {transforms, file});
		const source = file.buffer.length ? file.buffer : '/*beep. boop.*/';

		bundler.add(intoStream(source), {file: file.path});
		vendorsConfig.forEach(vendor => bundler.external(vendor));

		const userBundling = bundle(bundler);

		file.buffer = Buffer.concat([
			await vendorBundling,
			await userBundling
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
