import {stat as fsStat} from 'fs';
import denodeify from 'denodeify';

const stat = denodeify(fsStat);

const getMtime = async path => {
	try {
		const {mtime} = await stat(path);
		return mtime;
	} catch (error) {
		return new Date();
	}
};

export default getMtime;
