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

	const bundled = Object
		.entries(dependencies)
		.map(entry => {
			const [, dependency] = entry;
			return bundleFile(bundler, dependency);
		});

	return bundled[bundled.length - 1];
};
