const Inspection = require('./Inspection');
const severityLevel = require('../util/Severity');

module.exports = class ProjectInspection {

	constructor(name, inspections, issueDescriptions) {
		this.name = name;
		this.inspections = inspections
			.filter(element => element.name === 'Issue')
			.map(element => {
				const { attributes } = element;

				const issueDescription = issueDescriptions.get(attributes.TypeId);

				return new Inspection(issueDescription, attributes);
			});
	}

	showErrors() {
		return this.inspections
			.sort((first, second) => severityLevel[first.issue.severity] - severityLevel[second.issue.severity])
			.map(inspection => inspection.toString());
	}

};
