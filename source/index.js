import {debuglog} from 'util';

import {flatten} from 'lodash';

import createBundles from './create-bundles';
import createEntry from './create-entry';
import concatBundles from './concat-bundles';
import getImports from './get-imports';
import loadTransforms from './load-transforms';

const log = debuglog('browserify');

function disableBabelRuntime(config = {}, application) {
	const {opts = {}} = config;
	const {optional = []} = opts;
	if (optional.includes('runtime')) {
		opts.optional = optional.filter(item => item !== 'runtime');
		application.log.warn([
			'patternplate-transform-browserify removed the runtime transform',
			'from babelify configuration, because of known bugs.',
			'The new optional key for babelify is:',
			JSON.stringify(opts.optional.join(', '))
		].join(' '));
	}
}

export default application => {
	return async file => {
		const {
			transforms: transformConfig = {},
			externalTransforms: externalTransformConfig = {},
			opts: options
		} = application.configuration.transforms.browserify;

		disableBabelRuntime(transformConfig.babelify, application);

		const transforms = loadTransforms(transformConfig, application);
		const externalTransforms = loadTransforms(externalTransformConfig, application);

		const importsStart = new Date();
		const imports = await getImports(file);
		log(`resolved imports in ${new Date() - importsStart}ms`);

		const bundlingBundles = createBundles(imports, {options, transforms, externalTransforms, application});
		const bundlingEntry =	createEntry(file, imports, {options, transforms, application});

		const start = new Date();
		const jobs = [
			{message: 'created entry in', task: bundlingBundles},
			{message: 'created bundles in', task: bundlingEntry}]
			.map(async ({task, message}) => {
				const result = await task;
				log(`${message} ${new Date() - start}ms`);
				return result;
			});

		const bundles = flatten(await Promise.all(jobs));

		const concatStart = new Date();
		const buffer = await concatBundles(bundles, {path: file.path});
		log(`concatenated bundles in ${new Date() - concatStart}ms`);

		file.buffer = buffer;
		return file;
	};
};

module.change_code = 1; // eslint-disable-line camelcase
