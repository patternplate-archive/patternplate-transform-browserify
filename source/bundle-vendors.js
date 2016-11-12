/* @flow */
const browserify = require('browserify');
const bundle = require('./bundle');

module.exports = bundleVendors;

function bundleVendors(vendors: Array<string> = []): Promise<Buffer> {
	const bundler = browserify();
	vendors.forEach(vendor => {
		bundler.require(vendor, {expose: vendor});
	});
	return bundle(bundler);
}
