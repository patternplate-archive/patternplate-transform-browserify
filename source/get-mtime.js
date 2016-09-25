import fs from 'mz/fs';

export default getMtime;

async function getMtime(path) {
	try {
		const {mtime} = await fs.stat(path);
		return mtime;
	} catch (err) {
		return new Date();
	}
}
