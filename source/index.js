const md5 = require('md5');

const bundle = require('./bundle');
const bundleVendors = require('./bundle-vendors');
const createBundler = require('./create-bundler');
const createStream = require('./create-stream');
const loadTransforms = require('./load-transforms');

export default () => {
	return transformBrowserify;
};

async function transformBrowserify(file, _, config) {
	const opts = config.opts;
	const bundlers = {};
	const cachedResults = {};

	const vendors = config.vendors || [];
	const vendorBundle = bundleVendors(vendors);
	const vendorsKey = [`vendors`, ...vendors].join(':');

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

	const transforms = await loadTransforms(config.transforms);
	const bundler = createBundler(opts, {transforms, file, bundlers});

	bundler.add(createStream(file.buffer), {
		file: file.path
	});

	vendors.forEach(vendor => {
		bundler.external(vendor);
	});

	bundler.on('update', async () => {
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
}
