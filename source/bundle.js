/* @flow */
import type {Readable} from 'stream';

module.exports = bundle;

function bundle(bundler: Bundler): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		bundler.bundle((error, result) => {
			if (error) {
				return reject(error);
			}
			resolve(result);
		});
	});
}

type Bundler = { // eslint-disable-line no-undef
	add: (entry: Readable) => void;
	bundle: (callback: (error: Error|null, result: Buffer) => void) => void;
	external: (id: string) => void;
	on: (eventName: string, callback: () => void) => void;
};
