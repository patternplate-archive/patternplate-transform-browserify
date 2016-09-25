import {merge} from 'lodash';

export function getFile(extender) {
	const file = {
		path: 'mocks/index.js'
	};
	return merge({}, file, extender);
}
