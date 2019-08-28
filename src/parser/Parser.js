const parse = require('@rgrove/parse-xml');
const ProjectInspection = require('../structures/ProjectInspection');
const severityLevel = require('../util/Severity');
const core = require('@actions/core');

module.exports = class Parser {

	constructor(input, failureLevel) {
		this.input = input;
		this.issueDescriptions = new Map();
		this.projects = [];
		this.failureLevel = severityLevel[failureLevel];
	}

	parse() {
		const xml = parse(this.input);

		const [root] = xml.children;

		const issueTypes = root.children
			.find(element => element.name === 'IssueTypes')
			.children.filter(element => element.name === 'IssueType');

		const issues = root.children
			.find(element => element.name === 'Issues')
			.children.filter(element => element.name === 'Project');

		for (const issueType of issueTypes) {
			this.issueDescriptions.set(issueType.attributes.Id, issueType.attributes);
		}

		for (const issue of issues) {
			this.projects.push(new ProjectInspection(issue.attributes.Name, issue.children, this.issueDescriptions));
		}
	}

	showErrors() {
		for (const project of this.projects) {
			for (const error of project.showErrors()) {
				core.warning(error);
			}
		}
	}

	get hasFailed() {
		return this.projects.some(project => project.inspections.some(inspection => severityLevel[inspection.issue.severity] >= this.failureLevel));
	}

};
