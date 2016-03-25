import bundleFile from './bundle-file';

function squashDependencies(file) {
	return Object
		.entries(file.dependencies)
		.reduce((registry, entry) => {
			const [, dependency] = entry;
			const {pattern: {id}} = dependency;

			return {
				...registry,
				[id]: dependency,
				...squashDependencies(dependency)
			};
		}, {});
}

export default (bundler, file) => {
	const dependencies = squashDependencies(file);

	Object
		.entries(dependencies)
		.forEach(entry => {
			const [, dependency] = entry;
			bundleFile(bundler, dependency);
		});

	return bundler;
};
