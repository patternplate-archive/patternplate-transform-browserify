const browserResolve = require('browser-resolve');

module.exports = createResolver;

const cwd = process.cwd();

function createResolver(deps) {
	return (id, parent, cb) => {
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
