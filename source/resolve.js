import {join} from 'path';
import browserResolve from 'browser-resolve';

const filename = join(process.cwd(), 'package.json');

const resolveBundle = name => {
	return new Promise((resolve, reject) => {
		browserResolve(name, {
			filename
		}, (error, result) => {
			if (error) {
				reject(error);
			}
			resolve(result);
		});
	});
};

export default resolveBundle;
module.change_code = 1; // eslint-disable-line camelcase
