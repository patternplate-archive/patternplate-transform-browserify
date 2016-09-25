import {debuglog} from 'util';
import Concat from 'concat-with-sourcemaps';
import convertSourceMap from 'convert-source-map';

const log = debuglog('browserify');

export default function (bundles, options) {
	const concat = new Concat(true, options.path, ';');

	bundles.forEach(bundle => {
		const code = bundle.toString();
		const extractStart = new Date();
		const sourceMap = convertSourceMap.fromSource(code, true);
		log(`Extracted source map in ${new Date() - extractStart}ms`);

		const removeStart = new Date();
		const content = sourceMap ?
			convertSourceMap.removeComments(code) :
			code;
		log(`Removed source map in ${new Date() - removeStart}ms`);

		const payload = sourceMap ?
			sourceMap.toObject() :
			null;

		concat.add(null, content, payload);
	});

	const result = [
		concat.content.toString(),
		convertSourceMap.fromJSON(concat.sourceMap).toComment()
	]
	.filter(Boolean)
	.join(';\n');

	return result;
}
