import {debuglog} from 'util';

import {flatten} from 'lodash';

import createBundles from './create-bundles';
import createEntry from './create-entry';
import concatBundles from './concat-bundles';
import getImports from './get-imports';
import loadTransforms from './load-transforms';

const log = debuglog('browserify');

export default application => {
	const {
		transforms: transformConfig = {},
		externalTransforms: externalTransformConfig = {},
		opts: options
	} = application.configuration.transforms.browserify;
	const loadingTransforms = loadTransforms(transformConfig);
	const loadingExternalTransforms = loadTransforms(externalTransformConfig);

	return async file => {
		const transforms = await loadingTransforms;
		const externalTransforms = await loadingExternalTransforms;

		const importsStart = new Date();
		const imports = await getImports(file);

		imports.forEach(i => {
			if (i.external) {
				console.log(i.path);
			}
		});

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
