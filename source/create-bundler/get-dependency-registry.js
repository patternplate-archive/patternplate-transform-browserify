/* @flow */
const entries = require('lodash/entries');

type File = {
	buffer: Buffer;
	path: string;
};

type DependencyRegistry = {
	[path: string]: {
		[name: string]: string;
	}
};

module.exports = getDependencyRegistry;

function getDependencyRegistry(file: File, seed: DependencyRegistry = {}): DependencyRegistry {
	return entries(file.dependencies || {})
		.reduce((registry, entry) => {
			const [name, data] = entry;
			registry[file.path] = seed[file.path] || {};
			registry[file.path][name] = data.path;
			getDependencyRegistry(data, registry);
			return registry;
		}, seed);
}
