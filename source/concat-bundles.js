import Concat from 'concat-with-sourcemaps';
import convertSourceMap from 'convert-source-map';

export default function (bundles, options) {
	const concat = new Concat(true, options.path, ';\n');

	bundles.forEach(bundle => {
		const code = bundle.toString();
		const sourceMap = convertSourceMap.fromSource(code, true);
		const content = convertSourceMap.removeComments(code);
		concat.add(null, content, sourceMap.toObject());
	});

	return [
		concat.content,
		convertSourceMap.fromJSON(concat.sourceMap).toComment()
	].join('\n');
}

module.change_code = 1;
