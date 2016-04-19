import Vinyl from 'vinyl';

import createBundler from './create-bundler';
import concatBundles from './concat-bundles';
import loadTransforms from './load-transforms';
import promiseBundle from './promise-bundle';
import findDependencies from './find-dependencies';

const detect = /^((?:import|(?:.*?)require\()\s?[^=]*?["'])(.+?)(["'].*);?$/gm;

async function bundleExternal({external, transforms, opts}, application, cache) {
	const key = `browserify:externals:${external.map(item => item.expose).join(':')}`;
	const [{mtime}] = external
		.sort(({mtime: a}, {mtime: b}) => b.getTime() - a.getTime());

	const cached = cache.get(key, mtime);

	if (cached) {
		return cached;
	}

	const bundler = createBundler(opts, transforms, application);

	external.forEach(({path, expose}) => {
		bundler.require(path, {
			expose
		});
	});

	const code = await promiseBundle(bundler);
	cache.set(key, mtime, code);
	return code.toString();
}

async function bundleInternal({external, file, internal, transforms, opts}, application, cache) {
	const depKey = `browserify:internals:${internal.map(item => item.expose).join(':')}`;
	const key = `browserify:module:${file.path}`;

	const {fs: {node: {mtime}}} = file;
	const [freshestDep] = internal.sort(({mtime: a}, {mtime: b}) => b.getTime() - a.getTime());
	const depMtime = freshestDep ?
		freshestDep.mtime :
		new Date();

	const bundler = createBundler(opts, transforms, application);
	const depBundler = createBundler(opts, transforms, application);

	// Exclude externals
	external.forEach(({expose}) => {
		depBundler.exclude(expose);
		bundler.exclude(expose);
	});

	// Find collisions
	const collisions = internal.reduce((registry, dep) => {
		const matches = internal.filter(item => item !== dep && item.expose === dep.expose);
		return [...registry, ...matches];
	}, []);

	// Bundle internal dependencies
	internal.forEach(({path, buffer, expose}) => {
		const relevantCollisions = collisions.filter(item => item.from === path);

		// Handle collisions
		buffer = relevantCollisions.length === 0 ?
			buffer :
			buffer.replace(detect, (...args) => {
				const [match, before, name, after] = args;
				const [collision] = relevantCollisions.filter(({expose}) => expose === name);
				if (collision) {
					const replacement = `${before}${collision.id}${after}`;
					collision.expose = collision.id;
					return replacement;
				}
				return match;
			});

		const stream = new Vinyl({
			contents: new Buffer(buffer.toString()),
			path
		});

		depBundler.require(stream, {
			expose,
			file: path
		});

		depBundler.exclude(expose);
		bundler.exclude(expose);
	});

	// Add entry file
	const entryStream = new Vinyl({
		contents: new Buffer(file.buffer.toString()),
		path: file.path
	});

	bundler.add(entryStream, {
		file: file.path
	});

	const code = cache.get(key, mtime) ||
		await promiseBundle(bundler);

	const depCode = cache.get(depKey, depMtime) ||
		await promiseBundle(depBundler);

	cache.set(key, mtime, code);
	cache.set(depKey, depMtime, depCode);

	return concatBundles([depCode, code], {
		path: file.path
	});
}

export default application => {
	return async (file, demo, configuration) => {
		const {cache} = application;
		const {
			transforms: transformConfig = {},
			opts
		} = configuration;

		// load browserify transforms
		const transforms = loadTransforms(transformConfig, application);

		// find dependencies
		const {external, internal} = await findDependencies(file, cache);

		const bundlingExternal = bundleExternal({
			external,
			transforms,
			opts
		}, application, cache);

		const bundlingInternal = bundleInternal({
			external,
			internal,
			transforms,
			file,
			opts
		}, application, cache);

		const bundles = await Promise.all([
			bundlingExternal,
			bundlingInternal
		]);

		file.buffer = concatBundles(bundles, {
			path: file.path
		});

		return file;
	};
};

module.change_code = 1;
