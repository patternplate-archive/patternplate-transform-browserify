/* @flow */
/* eslint-disable no-use-before-define */
import type {Readable} from 'stream';

const browserify = require('browserify');
const memoize = require('lodash').memoize;
const intoStream = require('into-stream');
const resolveFrom = require('resolve-from');

const bundle = require('./bundle');
const createBundler = require('./create-bundler');
const loadTransforms = memoize(require('./load-transforms'));

module.exports = browserifyTransform;

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

function browserifyTransform(application: Application): Transform {
	const config = application.configuration.transforms.browserify;
	const opts = config.opts || {};

	const vendors = config.vendors || [];
	const externals = vendors.map(v => Array.isArray(v) ? v[0] : v);

	const resources = vendors.map(v => {
		const isShim = Array.isArray(v);
		const expose = isShim ? v[0] : v;
		const vendorPath = isShim ? v[1] : v;
		const resolved = resolveFrom(process.cwd(), vendorPath);
		const content = bundleResource(resolved, {expose});

		return {
			id: `browserify/${v}`,
			pattern: null,
			type: 'js',
			reference: true,
			content
		};
	});

	application.resources = [...(application.resources || []), ...resources];

	return async file => {
		const transforms = await loadTransforms(config.transforms || {});
		const bundler = createBundler(opts, {transforms, file});
		const source = file.buffer.length ? file.buffer : '/*beep. boop.*/';

		bundler.add(intoStream(source), {file: file.path});
		externals.forEach(external => bundler.external(external));

		const result = bundle(bundler);
		file.buffer = Buffer.from(await result);

		const isOverridden = file.basename === 'index' && `demo${file.ext}` in file.pattern.files;

		(file.pattern.post || []).forEach(p => {
			if (isOverridden) {
				return;
			}
			console.log(file.path);
			p(result);
		});

		return file;
	};
}

function bundleResource(id, opts) {
	return new Promise((resolve, reject) => {
		const b = browserify();
		b.require(id, opts);
		b.bundle((err, result) => {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
}
