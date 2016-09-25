import astDependencies from 'babylon-ast-dependencies';
import {parse} from 'babylon';
import memoizePromise from 'memoize-promise';
import {flattenDeep, difference, memoize, uniq, uniqBy} from 'lodash';

import resolve from './resolve';

const settings = {
	allowImportExportEverywhere: true,
	allowReturnOutsideFunction: true,
	sourceType: 'module',
	plugins: [
		'jsx',
		'asyncFunctions',
		'classConstructorCall',
		'doExpressions',
		'trailingFunctionCommas',
		'objectRestSpread',
		'decorators',
		'classProperties',
		'exportExtensions',
		'exponentiationOperator',
		'asyncGenerators',
		'functionBind',
		'functionSent'
	]
};

const extractImports = memoize(source => {
	const ast = parse(source, settings);
	const dependencies = astDependencies(ast);
	return uniq(dependencies.map(dependency => dependency.source));
});

const resolveImport = memoizePromise(resolve);

const getImports = async file => {
	const {buffer, dependencies} = file;
	const local = Object.keys(dependencies);
	const importNames = extractImports(buffer.toString());
	const externalNames = difference(importNames, local);

	const importItems = await Promise.all(
		importNames.map(async importName => {
			const isExternal = externalNames.includes(importName);

			const resolvingPath = isExternal ?
				resolveImport(importName) :
				dependencies[importName].path;

			const resolvingTree = isExternal ?
				null :
				getImports(dependencies[importName]);

			const buffer = isExternal ?
				null :
				dependencies[importName].buffer;

			const path = await resolvingPath;

			const item = {
				external: isExternal,
				from: {
					id: file.pattern.id,
					path
				},
				local,
				path: await resolvingPath,
				buffer,
				options: {
					expose: importName,
					file: path
				}
			};
			return [item, await resolvingTree].filter(Boolean);
		})
	);

	return uniqBy(flattenDeep(importItems), item => {
		return [item.path, item.options.expose].join(':');
	});
};

export default getImports;
