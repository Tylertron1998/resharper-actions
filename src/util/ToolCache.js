const toolcache = require('@actions/tool-cache');
const core = require('@actions/core');
const { exec } = require('@actions/exec');
const os = require('os');
const fetch = require('node-fetch');
const { inspect } = require('util');

const toolUrl = "https://data.services.jetbrains.com/products/releases?code=RSCLT&latest=true&type=release";

async function getInspector() {
	
	const platform = getCorrectPlatformString();
	const downloadData = await getDownloadInfo();
	let inspectCodeDirectory = toolcache.find('RSCLT', downloadData.version, platform);
	
	if (!inspectCodeDirectory) {

		const url = downloadData.downloads[platform].link;

		core.info('Cached Resharper Command Line Tools not found.');
		core.info(`Downloading Resharper Command Line Tools from ${url}`);
		
		const downloadedPath = await toolcache.downloadTool(url);
		core.info(`Download Path: ${downloadedPath}`);
		
		const extractedFolder = await toolcache.extractZip(downloadedPath);
		core.info(`Extracted Folder: ${extractedFolder}`);
		
		inspectCodeDirectory = await toolcache.cacheDir(extractedFolder, "RSCLT", downloadData.version, platform);
		core.info(`Cached Path: ${inspectCodeDirectory}`);
	} else {
		core.info('Using cached Resharper Command Line Tools.');
	}

	core.addPath(inspectCodeDirectory);
	
}

async function getDownloadInfo() {
	const downloads = await fetch(toolUrl).then(res => {
		if(!res.ok) {
			core.setFailed(res.statusText);
		} else {
			return res.json();
		}
	});

	const [data] = downloads.RSCLT;
	return data;

}

function getCorrectPlatformString() {
	const osString = os.platform();
	switch(osString) {
		case "win32": return "windows";
		case "darwin": return "mac";
		case "linux": return "linux";
	}
}

async function runInspector(solutionDirectory) {

	let stdout = "";
	let stderr = "";

	const options = {
		listeners: {
			stdout: (data) => {
				stdout += data.toString();
			},
			stderr: (data) => {
				stderr += data.toString();
			}
		},
		silent: true
	};

	try {
		await getInspector();
	await exec('inspectcode', [solutionDirectory, `-o="./output.xml"`], options);
	} catch(e) {
		core.error(stderr);
		core.setFailed(e);
	}
	core.debug(stdout);
}

module.exports = { runInspector, getInspector };
