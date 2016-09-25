module.exports = bundle;

function bundle(bundler) {
	return new Promise((resolve, reject) => {
		bundler.bundle((error, result) => {
			if (error) {
				return reject(error);
			}
			resolve(result);
		});
	});
}
