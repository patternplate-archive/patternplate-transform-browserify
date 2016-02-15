import {omit} from 'lodash';

export default function squashDependencies(file, registry = {}) {
	for (const dependencyName of Object.keys(file.dependencies)) {
		let dependency = file.dependencies[dependencyName];

		if (!(dependencyName in registry) || registry[dependencyName].path === dependency.path) {
			registry[dependencyName] = {
				path: dependency.path,
				source: dependency.source,
				buffer: dependency.buffer,
				dependencies: dependency.dependencies
			};
			file.dependencies = omit(file.dependencies, dependencyName);
			dependency = registry[dependencyName];
		}

		squashDependencies(dependency, registry);
	}

	return registry;
}
