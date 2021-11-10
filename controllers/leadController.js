const { ERRORS } = require('../utils/errors.js');
const { MarketoAPI } = require('../utils/MarketoAPI.js');

function generateNewDate(appendTo = null) {
	// generate a new date based in the same format as the createdAt and updatedAt dates
	let newDate = `${new Date().toISOString().split('.')[0]}Z`;

	// if no date is provided => return new date
	if (appendTo === null)
		return newDate;

	// else append new date to existing dates
	const appendedDate = `${appendTo},${newDate}`;

	return appendedDate;
}

const leadController = {

	updateTestDateInterviewByLeadId: async (req, res) => {
		const { leadId } = req.params;

		// check if leadId param is present
		if (!leadId)
			throw new Error(ERRORS.LEAD_ID_MISSING.error);

		// get lead form Marketo
		let lead = await MarketoAPI.getLeadById(leadId);

		// check if lead exists
		if (!lead)
			throw new Error(ERRORS.LEAD_NOT_FOUND.error);

		// if lead exists => proceed with update
		newTestDateInterview = generateNewDate(lead.testDateInterview);

		// create updatePayload
		const updatePayload =
		{
			lookupField: "id",
			input: [
				{
					id: lead.id,
					testDateInterview: newTestDateInterview
				}
			]
		}

		// send update payload to Marketo API to perform the actual update
		let updatedLead = await MarketoAPI.updateLeadById(updatePayload);

		// if error => error handler would have sent an error
		// otherwise => send updated lead here
		return res.status(201).json({
			data: {
				...updatedLead,
				testDateInterview: newTestDateInterview
			}
		});
	}
}

module.exports = leadController;