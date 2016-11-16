/* @flow */
const browserResolve = require('browser-resolve');

module.exports = createResolver;

const cwd = process.cwd();

function createResolver(deps: Dependencies): Function {  // eslint-disable-line no-use-before-define
	return (id: string, parent: ModuleContext, cb: Callback): void => {  // eslint-disable-line no-use-before-define
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

type ModuleContext = { // eslint-disable-line no-undef
	id: string;
	inNodeModules: boolean;
};

type Dependencies = { // eslint-disable-line no-undef
	[id: string]: Object;
};

type Callback = (err: null|Error, resolvedPath: string) => void; // eslint-disable-line no-undef
