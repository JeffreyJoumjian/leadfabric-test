// set up environment variables
require('./setUpEnv')();

// set up express
const express = require('express');
const app = express();
app.use(express.json());


// set up routes
const leadRouter = require('./routes/leads');
app.use('/lead', leadRouter);


// set up globaly async error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);


// get port
const PORT = process.env.PORT || 3000;

// start server
app.listen(PORT, () => {
	console.log(`server listening on ${PORT}`);
});
