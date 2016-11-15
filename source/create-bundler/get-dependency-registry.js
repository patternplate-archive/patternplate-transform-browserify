/* @flow */
const entries = require('lodash/entries');

module.exports = getDependencyRegistry;

function getDependencyRegistry(file: File, seed: DependencyRegistry = {}): DependencyRegistry {  // eslint-disable-line no-use-before-define
	return entries(file.dependencies || {})
		.reduce((registry, entry) => {
			const [name, data] = entry;
			registry[file.path] = seed[file.path] || {};
			registry[file.path][name] = data.path;
			getDependencyRegistry(data, registry);
			return registry;
		}, seed);
}

type File = { // eslint-disable-line no-undef
	buffer: Buffer;
	path: string;
};

type DependencyRegistry = { // eslint-disable-line no-undef
	[path: string]: {
		[name: string]: string;
	}
};
