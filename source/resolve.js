import {join} from 'path';
import browserResolve from 'browser-resolve';

const filename = join(process.cwd(), 'package.json');
export default resolveBundle;

function resolveBundle(name) {
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
}
