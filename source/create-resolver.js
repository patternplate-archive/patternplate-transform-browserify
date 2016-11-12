/* @flow */
const browserResolve = require('browser-resolve');

module.exports = createResolver;

const cwd = process.cwd();

type ModuleContext = {
	id: string;
	inNodeModules: boolean;
};

type Dependencies = {
	[id: string]: Object;
};

type Callback = (err: null|Error, resolvedPath: string) => void;

function createResolver(deps: Dependencies): Function {
	return (id: string, parent: ModuleContext, cb: Callback): void => {
		if (parent.inNodeModules) {
			return browserResolve(id, parent, cb);
		}

		const available = deps[parent.id] || {};
		const resolved = available[id];

		if (resolved) {
			return cb(null, resolved);
		}

		const opts = {...parent, basedir: cwd};
		browserResolve(id, opts, cb);
	};
}
