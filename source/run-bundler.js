import Vinyl from 'vinyl';

export default async function runBundler(input, configuration, file) {
	const bundler = await input;

	if (configuration && file) {
		bundler.add(new Vinyl({
			path: file.path,
			contents: new Buffer(file.buffer)
		}), configuration);
	}

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
