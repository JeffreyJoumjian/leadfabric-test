const { getError } = require("../utils/errors");

module.exports = async (err, req, res, next) => {
	console.log(err.message);
	// console.log(err.stack);

	// get error details from message
	const { status, message } = getError(err.message);

	// if no previous response has been sent already
	if (!res.headersSent)
		res.status(status).json({ error: message })

	next();
};