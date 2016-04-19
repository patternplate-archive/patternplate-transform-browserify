const detect = /^((?:import|(?:.*?)require\()\s?[^=]*?["'])(.+?)(["'].*);?$/gm;

const rewriteImports = file => {
	const {dependencies, buffer} = file;
	const code = buffer.toString();
	file.buffer = code.replace(detect, (...args) => {
		const [match, before, name, after] = args;
		if (name in dependencies) {
			const dependency = dependencies[name];
			return `${before}${dependency.pattern.id}${after}`;
		}
		return match;
	});
	return file;
};

export default rewriteImports;

module.change_code = 1; // eslint-disable-line camelcase
