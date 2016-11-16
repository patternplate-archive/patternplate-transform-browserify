/* @flow */
const browserify = require('browserify');
const bundle = require('./bundle');

module.exports = bundleVendors;

const semi = new Buffer(';', 'utf-8');

function append(result: Buffer): Buffer {
	return Buffer.concat([result, semi]);
}

async function bundleVendors(vendors: Array<string> = []): Promise<Buffer> {
	const bundler = browserify();
	vendors.forEach(vendor => {
		bundler.require(vendor, {expose: vendor});
	});
	return append(await bundle(bundler));
}
