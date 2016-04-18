import browserResolve from 'browser-resolve';

function resolve(name, base) {
	return new Promise(done => {
		browserResolve(name, {
			filename: base
		}, (error, result) => {
			if (error) {
				done();
			}
			done(result);
		});
	});
}

resolve.tryResolve = async (...args) => {
	try {
		return await resolve(...args);
	} catch (error) {
		return null;
	}
};

export default resolve;
module.change_code = 1;
