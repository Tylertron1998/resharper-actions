const core = require('@actions/core');
const Parser = require('./parser/Parser');
const { runInspector } = require('./util/ToolCache');
const fs = require('fs');

const solutionDirectory = core.getInput('SLN_DIR');
const failureLevel = core.getInput('FAIL_LEVEL');

runInspector(solutionDirectory);

const contents = fs.readFileSync('./output.xml', { encoding: 'utf8' });
const parser = new Parser(contents, failureLevel);

parser.parse();

if (parser.hasFailed) {
	parser.showErrors();
	core.setFailed('Resharper failed. Check log output.');
}