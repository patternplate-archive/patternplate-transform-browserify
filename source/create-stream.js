/* @flow */
import type {Readable} from 'stream';

const stringToStream = require('string-to-stream');

module.exports = createStream;

function createStream(raw: string|Buffer): Readable {
	return stringToStream(raw || '/**/', 'utf-8');
}
