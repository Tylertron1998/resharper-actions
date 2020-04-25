const DOWNLOAD_URL = `https://www.jetbrains.com/resharper/download/download-thanks.html?platform=${getCorrectPlatformString()}`;

const toolcache = require('@actions/tool-cache');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const os = require('os');


function getInspector() {
	if (!toolcache.find('inspectcode')) {
		core.debug('Downloading inspectcode...');
		const downloadedPath = toolcache.downloadTool(DOWNLOAD_URL);
		const extractedFolder = toolcache.extractZip(downloadedPath);

		const cachedPath = toolcache.cacheDir(extractedFolder);
		core.addPath(cachedPath);
	}
	core.debug('using cached inspectcode.');
}

function getCorrectPlatformString() {
	const osString = os.platform();
	switch(osString) {
		case "win32": return "windows";
		case "darwin": return "macos";
		case "linux": return "linux";
	}
}

async function runInspector(solutionDirectory) {
	getInspector();
	await exec('inspectcode', [solutionDirectory, `-o="./"`]);
}

module.exports = { runInspector, getInspector };
