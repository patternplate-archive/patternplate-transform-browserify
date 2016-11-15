/* @flow */
import type {Readable} from 'stream'; // eslint-disable-line no-unused-vars

const stringToStream = require('string-to-stream');

module.exports = createStream;

function createStream(raw: string|Buffer): Readable {
	return stringToStream(raw || '/**/', 'utf-8');
}
