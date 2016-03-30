const findDependencies = (file, cache, dependencies) => {
	const cacheKey = `browserify:filedependencies:${file.path}`;

	const fileDependencies = cache.get(cacheKey, file.mtime) ||
		(file.meta.dependencies || []);

	return [
		...dependencies,
		...fileDependencies,
		...Object.values(file.dependencies).reduce((memo, file) => [
			...memo,
			...findDependencies(file, cache, memo)
		], [])
	];
};

export default (...args) => {
	// return a sorted list of unique dependencies
	return [...(new Set(findDependencies(...args)))].sort();
};
