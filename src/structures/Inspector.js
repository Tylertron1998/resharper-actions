const core = require('@actions/core');
const Parser = require('../parser/Parser');
const { runInspector } = require('../util/ToolCache');
const fs = require('fs');

module.exports = class Inspector {
    
    async run() {
        const solutionDirectory = core.getInput('SLN_DIR', { required: true });
        const failureLevel = core.getInput('FAILURE_LEVEL', { required: true });

        await runInspector(solutionDirectory);

        const contents = fs.readFileSync('./output.xml', { encoding: 'utf8' });
        const parser = new Parser(contents, failureLevel);

        parser.parse();

        if (parser.hasFailed) {
            parser.showErrors();
            core.setFailed('Resharper failed. Check log output.');
        }
    }
}