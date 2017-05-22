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

type Pattern = {
	files: File[];
	post: Function[];
};

type Resource = {
	id: string;
	pattern: Pattern | null;
	type: string;
	reference: boolean;
	content: Promise<Buffer> | Promise<string>
};

type Application = {
	configuration: {
		transforms: {
			browserify: TransformBrowserifyOptions;
		}
	};
	resources?: Resource[];
};

type File = {
	pattern: Pattern;
	ext: string;
	basename: string;
	buffer: Buffer;
	path: string;
};

type Transform = (file: File) => Promise<File>;

function browserifyTransform(application: Application): Transform {
	const config = application.configuration.transforms.browserify;
	const resolve = id => resolveFrom(process.cwd(), id);

	const vendors = config.vendors || [];

	const vendorBundler = vendors
		.map(v => {
			const isShim = Array.isArray(v);
			const expose = isShim ? v[0] : v;
			const vendorPath = isShim ? v[1] : v;
			return {id: resolve(vendorPath), expose};
		})
		.reduce((b, v) => {
			b.require(v.id, {expose: v.expose});
			return b;
		}, browserify());

	const vendorResource = {
		id: `browserify/vendors`,
		pattern: null,
		type: 'js',
		reference: true,
		content: bundle(vendorBundler)
	};

	application.resources = [...(application.resources || []), vendorResource];

	return async (file, _, c) => {
		const transforms = await loadTransforms(config.transforms || {});
		const bundler = createBundler(c.opts || {}, {transforms, file});
		const source = file.buffer.length ? file.buffer : '/*beep. boop.*/';

		bundler.add(intoStream(source), {file: file.path});

		(c.vendors || [])
			.map(v => Array.isArray(v) ? v[0] : v)
			.forEach(e => bundler.external(e));

		const result = bundle(bundler);
		file.buffer = Buffer.from(await result);

		const isOverridden = file.basename === 'index' && `demo${file.ext}` in file.pattern.files;

		(file.pattern.post || []).forEach(p => {
			if (isOverridden) {
				return;
			}
			p(result, file);
		});

		return file;
	};
}
