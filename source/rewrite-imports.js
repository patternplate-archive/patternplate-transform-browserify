const detect = /^((?:import|(?:.*?)require\()\s?[^=]*?["'])(.+?)(["'].*);?$/gm;

const rewriteImports = file => {
	const {dependencies, buffer} = file;
	const code = buffer.toString();
	file.buffer = code.replace(detect, (...args) => {
		const [match, before, name, after] = args;
		// Dependency is in pattern.json
		if (name in dependencies) {
			const dependency = dependencies[name];
			return `${before}${dependency.pattern.id}${after}`;
		} else if (Object.values(dependencies).map(dep => dep.pattern.id).indexOf(name) > -1) {
			return match;
		}

		try {
			// Dependecy is located in node_modules
			require.resolve(name);
		} catch (error) {
			// Dependecy missing
			const message = [
				`Could not resolve dependency ${name} of ${file.path}`,
				`in pattern ${file.pattern.id}, it is not in pattern.json`,
				`and could not be loaded from npm. Available pattern dependencies:`,
				Object.keys(dependencies).join(', ')
			].join(' ');
			error.message = [
				message,
				error.message
			].join('\n');
			throw error;
		}
	});

	// Apply rewrites to dependencies, too
	file.dependencies = Object.entries(file.dependencies)
		.reduce((registry, entry) => {
			const [name, dependency] = entry;
			return {
				...registry,
				[name]: rewriteImports(dependency)
			};
		}, {});

	return file;
};

export default rewriteImports;
