const stringToStream = require('string-to-stream');

module.exports = createStream;

function createStream(raw, opts = {}) {
	return stringToStream(raw || '/**/', 'utf-8');
}
