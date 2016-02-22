import {resolve} from 'try-require';

const detect = /^((?:import|(?:.*?)require\()\s?[^=]*?["'])(.+?)(["'].*);?$/gm;

const rewriteImports = file => {
	const {dependencies, buffer} = file;
	const code = buffer.toString();
	file.buffer = code.replace(detect, (...args) => {
		const [match, before, name, after] = args;
		if (name in dependencies) {
			// Dependency is in pattern.json
			const dependency = dependencies[name];
			return `${before}${dependency.pattern.id}${after}`;
		} else if (Object.values(dependencies).map(dep => dep.pattern.id).indexOf(name) > -1) {
			// Reverse lookup matches, makes this idempotent
			return match;
		}

		const available = resolve(name);
		if (available) {
			// Dependency can be resolved from npm
			return match;
		}

		// Dependecy is missing
		const message = [
			`Could not resolve dependency ${name} of ${file.path}`,
			`in pattern ${file.pattern.id}, it is not in pattern.json`,
			`and could not be loaded from npm. Available pattern dependencies:`,
			Object.keys(dependencies).join(', ')
		].join(' ');

		throw new Error(message);
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
