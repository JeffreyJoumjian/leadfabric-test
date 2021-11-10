const fetch = require('node-fetch');

const MarketoQueryGenerator = {

	// Generate the req to be sent to the auth Marketo endpoint for a new token
	generateTokenRequest: () => {
		const { HOST, CLIENT_ID, CLIENT_SECRET } = process.env;

		const query = `${HOST}/identity/oauth/token` +
			`?grant_type=client_credentials` +
			`&client_id=${CLIENT_ID}` +
			`&client_secret=${CLIENT_SECRET}`;

		const options = undefined;

		return [query, options];
	},

	// Generate the req to be sent to the Marketo endpoint to get a lead by id
	generateLeadRequest: (leadId) => {
		const { HOST, ACCESS_TOKEN } = process.env;

		const fields = ["id", "createdAt", "updatedAt", "testDateInterview"];

		const query = `${HOST}/rest/v1/lead/${leadId}.json` +
			`?fields=${fields.join(',')}`;

		const options = {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${ACCESS_TOKEN}`
			}
		}

		return [query, options];
	},

	// Generate the req to be sent to the Marketo endpoint to update a lead by syncPayload
	generateUpdateLeadRequest: (updatePayload) => {
		const { HOST, ACCESS_TOKEN } = process.env;

		const query = `${HOST}/rest/v1/leads.json`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${ACCESS_TOKEN}`
			},
			body: JSON.stringify(updatePayload)
		}

		return [query, options];
	}
}

const MarketoAPI = {

	// check if the Marketo res object has errors => failed request
	checkErrors: (marketoRes) => {
		let hasErrors = false;
		let errorMessage = "";

		if (marketoRes.errors && marketoRes.errors.length > 0) {
			let error = marketoRes.errors[0];

			hasErrors = true;
			errorMessage = `Marketo Error: ${error.code} ${error.message}`;
		}

		return [hasErrors, errorMessage];
	},

	// check the Marketo res for errors regarding the token
	isValidToken: (marketoRes) => {

		if (!marketoRes.errors || marketoRes.errors.length === 0)
			return true;

		let tokenError = marketoRes.errors[0].code;

		return (tokenError === 601 || tokenError === 602);
	},

	// get a new access token from Marketo
	getAccessToken: async function () {
		let [query,] = MarketoQueryGenerator.generateTokenRequest();

		let req = await fetch(query);
		let res = await req.json();

		const [errors, errorMessage] = this.checkErrors(res);

		if (errors)
			throw new Error(errorMessage);

		const token = res.access_token;

		process.env.ACCESS_TOKEN = token;
	},

	/**
	 * @param {function} queryGeneratorCallback the function to be called to generate a query string for the request.
	 * @param {string | updatePayload} queryInput optional parameters if any to be passed to the queryGeneratorCallback.
	 */
	sendRequest: async function (queryGeneratorCallback, queryInput = undefined) {

		let data = undefined;

		let [query, options] = queryGeneratorCallback(queryInput);

		let req = await fetch(query, options);
		let res = await req.json();

		// if token is invalid or expired => get a new token and generate new query with updated token
		if (!this.isValidToken(res)) {
			await this.getAccessToken();
			[query, options] = queryGeneratorCallback(queryInput);
		}

		// make new request with updatedToken
		req = await fetch(query, options);
		res = await req.json();

		const [errors, errorMessage] = this.checkErrors(res);

		if (errors)
			throw new Error(errorMessage);

		// get first resulting lead item (always only 1 item since we're getting by a unique id)
		if (res.result && res.result.length > 0)
			data = res.result[0];

		return data;
	},

	// takes a leadId and calls the sendRequest function to get the corresponding lead from Marketo
	getLeadById: async function (leadId) {

		let lead = await this.sendRequest(
			MarketoQueryGenerator.generateLeadRequest,
			leadId
		);

		return lead;
	},

	// takes the updatePayload object, which has the updated value for testDateInterview and sends and update request to Marketo
	updateLeadById: async function (updatePayload) {

		let updatedLead = await this.sendRequest(
			MarketoQueryGenerator.generateUpdateLeadRequest,
			updatePayload
		);

		return updatedLead;
	}
}

module.exports = {
	MarketoQueryGenerator,
	MarketoAPI
};