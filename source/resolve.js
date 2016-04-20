import {join} from 'path';
import browserResolve from 'browser-resolve';

const filename = join(process.cwd(), 'package.json');

const resolve = name => {
	return new Promise((done, reject) => {
		browserResolve(name, {
			filename
		}, (error, result) => {
			if (error) {
				reject(error);
			}
			done(result);
		});
	});
};

export default resolve;
module.change_code = 1; // eslint-disable-line camelcase
