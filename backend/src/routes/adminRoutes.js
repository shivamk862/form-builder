
const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin form routes
router.use(authMiddleware);

router.post('/forms', formController.createForm);
router.put('/forms/:id', formController.updateForm);
router.delete('/forms/:id', formController.deleteForm);

router.post('/forms/:id/fields', formController.addField);
router.put('/forms/:id/fields/:fieldId', formController.updateField);
router.delete('/forms/:id/fields/:fieldId', formController.deleteField);

router.get('/forms/:id/submissions', submissionController.getSubmissions);
router.get('/forms/:id/submissions/export', submissionController.exportSubmissions);
router.get('/submissions/:id/file', submissionController.getSubmissionFile);

module.exports = router;
