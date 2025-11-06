
const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const submissionController = require('../controllers/submissionController');

// Public form routes
router.get('/forms', formController.getForms);
router.get('/forms/:id', formController.getFormById);
router.post('/forms/:id/submit', submissionController.uploadFile, submissionController.submitForm);

module.exports = router;
