import Vinyl from 'vinyl';

export default (bundler, file, entry = false) => {
	const contents = new Buffer(file.buffer.toString());
	const stream = new Vinyl({
		contents,
		path: file.path
	});

	if (entry) {
		bundler.add(stream);
	} else {
		bundler.require(stream, {
			expose: file.pattern.id
		});
		bundler.exclude(file.pattern.id);
	}

	return bundler;
};
