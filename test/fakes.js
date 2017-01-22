import fs from 'fs';
import rimraf from 'rimraf';

export function createFakeDir() {
	fs.mkdirSync('fakes');
}

export function createFakeModule() {
	fs.mkdirSync('node_modules/fake-module');
	fs.writeFileSync('node_modules/fake-module/index.js', 'const test = true;\n');
}

export function createLinkedFakeModule() {
	fs.mkdirSync('fakes/link-dest');
	fs.writeFileSync('fakes/link-dest/index.js', 'const test = true;\n');
	fs.linkSync('fakes/link-dest', 'node_modules/linked-fake-module');
}

export function cleanUpFakes() {
	rimraf.sync('fakes');
	rimraf.sync('node_modules/fake-module');
	rimraf.sync('node_modules/linked-fake-module');
}
