const Vinyl = require('vinyl');

module.exports = createStream;

function createStream(content, opts = {}) {
	const raw = Buffer.isBuffer(content) ? content.toString() : content;
	opts.contents = new Buffer(raw || '/**/', 'utf-8');
	return new Vinyl(opts);
}
