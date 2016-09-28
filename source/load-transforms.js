import r from 'resolve';

export default async function(configuration) {
	const jobs = Object.entries(configuration || {})
		.filter(transformEntry => {
			const [, transform] = transformEntry;
			return transform.enabled;
		})
		.map(async transformEntry => {
			return [await getPackage(transformEntry[0]), transformEntry[1]];
		});

	const resolved = await Promise.all(jobs);

	return resolved.map(entry => {
		const [name, transform] = entry;
		const {opts} = transform;
		const fn = require(name);
		return {fn, name, opts};
	});
}

async function getPackage(id) {
	try {
		return await resolvePackage(id);
	} catch (error) {
		return await resolvePackage(id, __dirname);
	}
}

function resolvePackage(id, cwd) {
	return new Promise((resolve, reject) => {
		const opts = {
			basedir: cwd || process.cwd()
		};
		r(id, opts, (error, result) => {
			if (error) {
				return reject(error);
			}
			resolve(result);
		});
	});
}
