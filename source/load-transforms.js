import r from 'resolve';

export default async function(configuration) {
	const jobs = Object.entries(configuration || {})
		.filter(transformEntry => {
			const [, transform] = transformEntry;
			return transform.enabled;
		})
		.map(async transformEntry => {
			return [await resolvePackage(transformEntry[0]), transformEntry[1]];
		});

	const resolved = await Promise.all(jobs);

	return resolved.map(entry => {
		const [name, transform] = entry;
		const {opts} = transform;
		const fn = require(name);
		return {fn, name, opts};
	});
}

function resolvePackage(id) {
	return new Promise((resolve, reject) => {
		const opts = {
			basedir: process.cwd()
		};
		r(id, opts, (error, result) => {
			if (error) {
				return reject(error);
			}
			resolve(result);
		});
	});
}

module.change_code = 1; // eslint-disable-line camelcase
