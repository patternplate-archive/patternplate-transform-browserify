export default async function runBundler(bundler) {
	return new Promise((resolver, rejecter) => {
		bundler.bundle((err, buffer) => {
			if (err) {
				return rejecter(err);
			}

			resolver({
				buffer: buffer || new Buffer('')
			});
		});
	});
}
