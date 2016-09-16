import fs from 'mz/fs';

const getMtime = async path => {
	try {
		const {mtime} = await fs.stat(path);
		return mtime;
	} catch (err) {
		return new Date();
	}
};

export default getMtime;
