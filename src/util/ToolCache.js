const DOWNLOAD_URL = 'https://www.jetbrains.com/resharper/download/download-thanks.html?platform=windows&code=RSCLT';

const toolcache = require('@actions/tool-cache');
const core = require('@actions/core');
const { exec } = require('@actions/exec');


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

async function runInspector(solutionDirectory) {
	getInspector();
	await exec('inspectcode', [solutionDirectory, `-o="./"`]);
}

module.exports = { runInspector, getInspector };
