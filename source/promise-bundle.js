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
