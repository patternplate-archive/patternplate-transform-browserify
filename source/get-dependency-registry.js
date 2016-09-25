module.exports = getDependencyRegistry;

function getDependencyRegistry(file, seed = {}) {
	return Object.entries(file.dependencies || {})
		.reduce((registry, entry) => {
			const [name, data] = entry;
			registry[file.path] = seed[file.path] || {};
			registry[file.path][name] = data.path;
			getDependencyRegistry(data, registry);
			return registry;
		}, seed);
}
