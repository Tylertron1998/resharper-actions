module.exports = class Issue {

	constructor(description, severity, wikiUrl) {
		this.description = description;
		this.severity = severity;
		this.wikiUrl = wikiUrl || null;
	}

};
