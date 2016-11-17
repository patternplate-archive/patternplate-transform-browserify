/* @flow */
import {merge} from 'lodash';

type Map = {
	[name: string]: any;
};

type FileMap = { // eslint-disable-line no-undef
	[name: string]: any;
	path: string;
};

export function getFile(extender: Map): FileMap { // eslint-disable-line import/prefer-default-export
	const file = {
		path: 'mocks/index.js'
	};
	return merge({}, file, extender);
}
