import {stat} from 'fs';
import {uniqBy} from 'lodash';
import {tryResolve} from './resolve';

// import rewriteImports from './rewrite-imports';

const detect = /^(?:(?:import|(?:.*?)require\()\s?[^=]*?["'])(.+?)(?:["'].*);?$/gm;

const fsstat = path => {
	return new Promise((resolve, reject) => {
		return stat(path, (err, result) => err ? reject(err) : resolve(result));
	});
};

function findImportNames(code) {
	const imports = [];
	let result;
	while ((result = detect.exec(code)) !== null) {
		imports.push(result[1]);
	}
	return imports;
}

async function findDependencies(file, cache, internal = [], external = []) {
	const {dependencies, buffer} = file;
	const code = buffer.toString();
	const importNames = findImportNames(code);

	const resolveTasks = importNames
		.map(async importName => {
			const dependency = dependencies[importName];
			if (dependency) {
				internal.push({
					path: dependency.path,
					mtime: dependency.fs.node.mtime,
					buffer: dependency.buffer,
					id: dependency.pattern.id,
					from: file.path,
					expose: importName
				});

				const {
					dependencyInternal,
					dependencyExternal
				} = await findDependencies(dependency, cache, internal, external);

				internal.push(...dependencyInternal);
				external.push(...dependencyExternal);
				return;
			}

			const available = await tryResolve(importName, file.path);

			if (available) {
				const stat = await fsstat(available);

				external.push({
					path: available,
					expose: importName,
					buffer: null,
					mtime: stat.mtime
				});
			}
		});

	await Promise.all(resolveTasks);

	return {
		internal: uniqBy(internal, item => [item.id, item.expose].join(':')),
		external: uniqBy(external, item => [item.id, item.expose].join(':'))
	};
}

export default findDependencies;

module.change_code = 1;
