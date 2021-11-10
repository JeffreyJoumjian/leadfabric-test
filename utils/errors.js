const ERRORS = {
	"LEAD_ID_MISSING": {
		error: "LEAD_ID_MISSING",
		status: 400,
		message: 'Please provide a valid lead id'
	},
	"LEAD_NOT_FOUND": {
		error: "LEAD_NOT_FOUND",
		status: 404,
		message: 'The lead with the provided leadId was not found',
	},
	"LEAD_UPDATE_FAILED": {
		error: "LEAD_UPDATE_FAILED",
		status: 500,
		message: 'Failed to update the lead with the given leadId'
	}
};


function getError(err) {
	const defaultError = { status: 500, message: err };
	return ERRORS[err] || defaultError;
}

module.exports = {
	ERRORS,
	getError
}