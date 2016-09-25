import {dirname} from 'path';
import {debuglog} from 'util';

import Vinyl from 'vinyl';
import createBundler from './create-bundler';
import getMtime from './get-mtime';
import promiseBundle from './promise-bundle';

const log = debuglog('browserify');

const createEntry = async (file, imports, context) => {
	const {options, transforms, application} = context;
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

	const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : new Buffer(file.buffer);
	const base = dirname(file.path);
	const contents = buffer.length === 0 ? new Buffer(`// ${file.path}`) : buffer;

	const bundler = createBundler(options, transforms);

	const stream = new Vinyl({
		base,
		path: file.path,
		contents
	});

	bundler.add(stream, {
		basedir: base,
		noParse: true
	});

	bundler.exclude(file.path);

	[file.path, ...excluded].forEach(name => {
		bundler.exclude(name);
	});

	const result = promiseBundle(bundler);
	application.cache.set(key, mtime, result);
	return result;
};

export default createEntry;
