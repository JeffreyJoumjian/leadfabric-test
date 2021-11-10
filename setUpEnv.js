module.exports = function () {

	require('dotenv').config();

	let ENV_VARIABLES = [
		"HOST",
		"CLIENT_ID",
		"CLIENT_SECRET",
	];

	// check if all env variables are defined
	let missing = ENV_VARIABLES.find(ev => !process.env[ev])
	if (missing) {
		throw new Error(`Missing environment variable: ${missing}`);
	}
}