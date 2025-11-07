
const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const submissionController = require('../controllers/submissionController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin login route (no authentication required for this endpoint)
router.post('/login', authController.adminLogin);

// Admin form routes (authentication required for these endpoints)
router.post('/forms', authMiddleware, formController.createForm);
router.put('/forms/:id', authMiddleware, formController.updateForm);
router.delete('/forms/:id', authMiddleware, formController.deleteForm);

router.post('/forms/:id/fields', authMiddleware, formController.addField);
router.put('/forms/:id/fields/:fieldId', authMiddleware, formController.updateField);
router.delete('/forms/:id/fields/:fieldId', authMiddleware, formController.deleteField);

router.get('/forms/:id/submissions', authMiddleware, submissionController.getSubmissions);
router.get('/forms/:id/submissions/export', authMiddleware, submissionController.exportSubmissions);
router.get('/submissions/:id/file', authMiddleware, submissionController.getSubmissionFile);

module.exports = router;
