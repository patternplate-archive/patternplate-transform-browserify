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

export const fileWithModuleDeps = getFile({
	buffer: 'require(\'fake-module\');',
	path: 'fakes/index.js',
	dependencies: {}
});

export const fileWithLinkedModuleDeps = getFile({
	buffer: 'require(\'linked-fake-module\');',
	path: 'fakes/index.js',
	dependencies: {}
});

export const emptyBufferFile = getFile({
	buffer: new Buffer(''),
	path: 'empty/index.js',
	dependencies: {}
});
