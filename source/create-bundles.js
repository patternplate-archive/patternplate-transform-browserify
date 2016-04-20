import {createReadStream as fsRead} from 'fs';
import {debuglog} from 'util';

import denodeify from 'denodeify';
import Vinyl from 'vinyl';
import memoizePromise from 'memoize-promise';
import createBundler from './create-bundler';
import getMtime from './get-mtime';
import promiseBundle from './promise-bundle';

const readStream = memoizePromise(denodeify(fsRead));
const log = debuglog('browserify');

const getBundleFactory = (excluded, options, transforms, externalTransforms, application) => {
	return async (external, path, content, options) => {
		const key = [
			'browserify',
			'bundles',
			path,
			options.expose
		].join(':');

		const start = new Date();
		const mtime = await getMtime(path);
		log(`determined mtime for ${path} in ${new Date() - start}ms`);
		const cached = application.cache.get(key, mtime);

		if (cached) {
			log('using cached bundle:', key);
			return cached;
		}

		const bundler = createBundler(options, external ? externalTransforms : transforms);

		const contents = Buffer.isBuffer(content) ?
			content :
			new Buffer(typeof content === 'string' ? content : '');

		const stream = external ?
			readStream(path) :
			new Vinyl({contents});

		bundler.require(stream, options);

		excluded.forEach(name => {
			bundler.exclude(name);
		});

		const result = promiseBundle(bundler);
		application.cache.set(key, mtime, result);
		return result;
	};
};

const createBundles = async (imports, options, transforms, externalTransforms, application) => {
	const excluded = imports.map(item => item.options.expose);
	const bundleFactory = getBundleFactory(excluded, options, transforms, externalTransforms, application);

	const creating = imports.map(async item => {
		const start = new Date();
		const result = await bundleFactory(item.external, item.path, item.buffer, item.options);
		log(`created bundle for ${item.path} in ${new Date() - start}ms`);
		return result;
	});

	return await Promise.all(creating);
};

export default createBundles;

module.change_code = 1; // eslint-disable-line camelcase
