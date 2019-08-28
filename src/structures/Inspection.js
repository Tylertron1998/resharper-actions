const Issue = require('./Issue');

module.exports = class Inspection {

	constructor(issueDescription, data) {
		this.file = data.File;
		this.line = data.Line || 1;
		this.message = data.Message;
		this.offset = data.Offset;
		this.issue = new Issue(issueDescription.Description, issueDescription.Severity, issueDescription.WikiUrl);
	}

	toString() {
		return `[${this.issue.severity}] ${this.message}${this.issue.description ? ` (${this.issue.description})` : ''} at ${this.file}#L${this.line}, ${this.offset}.`;
	}

};
