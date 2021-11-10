const { MarketoAPI } = require('../utils/MarketoAPI');

module.exports = async (req, res, next) => {
	try {
		// if no access token is set => get a new access token
		if (!process.env.ACCESS_TOKEN)
			await MarketoAPI.getAccessToken();
		next();
	}
	catch (err) {
		next(err);
	}
}