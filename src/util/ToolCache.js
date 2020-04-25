const toolcache = require('@actions/tool-cache');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const os = require('os');


async function getInspector() {
	if (!toolcache.find('inspectcode', "1.0.0")) {
		const url = `https://www.jetbrains.com/resharper/download/#section=commandline?platform=${getCorrectPlatformString()}`;
		console.log(`Downloading inspectcode from ${url}`);
		const downloadedPath = await toolcache.downloadTool(url);
		console.log(`Download Path: ${downloadedPath}`);
		const extractedFolder = await toolcache.extractZip(downloadedPath);
		console.log(`Extracted Folder: ${extractedFolder}`);
		const cachedPath = await toolcache.cacheDir(extractedFolder, "inspectcode", "1.0.0");
		console.log(`Cached Path: ${cachedPath}`);
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
	try {
		await getInspector();
	await exec('inspectcode', [solutionDirectory, `-o="./"`]);
	} catch(e) {
		console.error(e);
	}
}

module.exports = { runInspector, getInspector };
