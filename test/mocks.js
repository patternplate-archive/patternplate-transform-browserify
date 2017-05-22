/* @flow */
import {getFile} from './helpers';

export const application = {
	cache: {
		get() {
			return false;
		},
		set() {
		}
	},
	configuration: {
		transforms: {
			browserify: {}
		}
	}
};

export const emptyFile = getFile({
	buffer: '',
	path: 'empty/index.js',
	dependencies: {}
});

export const emptyBufferFile = getFile({
	buffer: Buffer.from(''),
	path: 'empty/index.js',
	dependencies: {}
});
