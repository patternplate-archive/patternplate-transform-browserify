import {dirname} from 'path';
import {debuglog} from 'util';

import Vinyl from 'vinyl';
import createBundler from './create-bundler';
import getMtime from './get-mtime';
import promiseBundle from './promise-bundle';

const log = debuglog('browserify');

const createEntry = async (file, imports, options, transforms, application) => {
	const excluded = imports.map(item => item.options.expose);

	const key = [
		'browserify',
		'entry',
		file.path
	].join(':');

	const start = new Date();
	const mtime = await getMtime(file.path);
	log(`determined mtime for entry ${file.path} in ${new Date() - start}ms`);
	const cached = application.cache.get(key, mtime);

	if (cached) {
		log('using cached entry', file.path);
		return cached;
	}

	const {buffer} = file;
	const contents = Buffer.isBuffer(buffer) ?
		buffer :
		new Buffer(typeof buffer === 'string' ? buffer : '');

	const bundler = createBundler(options, transforms);
	const stream = new Vinyl({contents});
	bundler.add(stream, {
		file: file.path,
		basedir: dirname(file.path),
		noParse: true
	});
	excluded.forEach(name => {
		bundler.exclude(name);
	});
	const result = promiseBundle(bundler);
	application.cache.set(key, mtime, result);
	return result;
};

export default createEntry;

module.change_code = 1; // eslint-disable-line camelcase
