import {merge} from 'lodash';

export function getFile(extender) {
	const file = {
		path: 'mocks/index.js',
		/*fs: {
			node: {
				mtime: 0
			}
		},
		pattern: {
			manifest: {
				name: 'test'
			}
		},
		dependencies: {},
		meta: {
			dependencies: [],
			react: {
			}
		}*/
	};
	return merge({}, file, extender);
}
