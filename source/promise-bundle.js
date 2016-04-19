export default bundler => {
	return new Promise((resolve, reject) => {
		bundler.bundle((err, result) => {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

module.change_code = 1; // eslint-disable-line camelcase
