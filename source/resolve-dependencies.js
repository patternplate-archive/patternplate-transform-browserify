import {dirname} from 'path';
import browserify from 'browserify';
import Vinyl from 'vinyl';

import squashDependencies from './squash-dependencies';
import runBundler from './run-bundler';

export default async function resolveDependencies(file, configuration) {
	const dependencies = squashDependencies(file);

	for (const expose of Object.keys(dependencies)) {
		const dependency = dependencies[expose];

		// Nested dependencies
		if (dependency.dependencies && Object.keys(dependency.dependencies).length > 0) {
			const basedir = dirname(dependency.path);
			const opts = {expose, basedir};

			const dependencyBundler = resolveDependencies(dependency, Object.assign(
				{}, configuration.opts, opts,
				{standalone: expose}
			));
			let transformed;
			try {
				transformed = await runBundler(dependencyBundler, configuration, dependency);
			} catch (err) {
				throw err;
			}

			dependency.buffer = transformed.buffer.toString('utf-8');
		}
	}
	const contents = new Buffer(file.buffer);
	const bundler = browserify(new Vinyl({
		contents,
		path: file.path
	}), configuration.opts);

	for (const expose of Object.keys(dependencies)) {
		const dependency = dependencies[expose];
		const basedir = dirname(dependency.path);
		const opts = {expose, basedir};
		bundler.exclude(expose);
		bundler.require(new Vinyl({
			path: dependency.path,
			contents: new Buffer(dependency.buffer)
		}), Object.assign({}, configuration.opts, opts));
	}

	return bundler;
}
