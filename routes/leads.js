const authMiddleware = require('../middleware/authMiddleware.js');
const leadController = require('../controllers/leadController.js');

// handle both sync / async errors without try/catch
const asyncify = require('express-asyncify');
const router = asyncify(require('express').Router());

// https:localhost:3000/:leadId
router.post('/:leadId', authMiddleware, leadController.updateTestDateInterviewByLeadId);

module.exports = router;