/* @flow */
const entries = require('lodash/entries');
const r = require('resolve');

module.exports = loadTransforms;

async function loadTransforms(configuration: TransformsConfiguration): Promise<BrowserifyTransforms> { // eslint-disable-line no-use-before-define
	const jobs = entries(configuration || {})
		.filter(transformEntry => {
			const [, transform] = transformEntry;
			return transform.enabled;
		})
		.map(async transformEntry => {
			return [await resolvePackage(transformEntry[0]), transformEntry[1]];
		});

	const resolved = await Promise.all(jobs);

	return resolved.map(entry => {
		const [name, transform] = entry;
		const {opts} = transform;
		// $FlowFixMe
		const fn = require(name); // eslint-disable-line import/no-dynamic-require
		return {fn, name, opts};
	});
}

function resolvePackage(id: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const opts = {
			basedir: process.cwd()
		};
		r(id, opts, (error, result) => {
			if (error) {
				return reject(error);
			}
			resolve(result);
		});
	});
}

type BrowserifyTransform = {
	fn: Function;
	name: string;
	opts: Object;
};

type BrowserifyTransforms = Array<BrowserifyTransform>; // eslint-disable-line no-undef
type TransformsConfiguration = {[transformName: string]: Object}; // eslint-disable-line no-undef
