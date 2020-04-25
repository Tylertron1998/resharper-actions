const Inspector = require('./structures/Inspector');
const core = require('@actions/core');
try {
	const inspector = new Inspector();
	inspector.run();
} catch(e) {
	core.setFailed(e);
}
