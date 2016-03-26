import {stat} from 'fs';

const fsstat = path => {
	return new Promise((resolve, reject) => {
		return stat(path, (err, result) => err ? reject(err) : resolve(result));
	});
};

export default async paths => {
	const stats = await Promise.all(paths.map(fsstat));
	return stats
		.map(fileStat => fileStat.mtime)
		.sort((a, b) => b.getTime() - a.getTime())[0];
};
