
const Submission = require('../models/Submission');
const Form = require('../models/Form');
const { validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const { exportToCsv } = require('../utils/csvExporter');

// @desc    Submit a form
// @route   POST /api/forms/:id/submit
// @access  Public
exports.submitForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const answers = new Map();
    for (const field of form.fields) {
      let answer = req.body[field.name];
      if (answer) {
        answer = sanitizeHtml(answer);
        answers.set(field.name, answer);
      }
    }

    const submission = new Submission({
      form: form._id,
      formVersion: form.version,
      answers,
    });

    await submission.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all submissions for a form
// @route   GET /api/admin/forms/:id/submissions
// @access  Admin
exports.getSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const submissions = await Submission.find({ form: req.params.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Submission.countDocuments({ form: req.params.id });

    res.json({
      submissions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Export submissions as CSV
// @route   GET /api/admin/forms/:id/submissions/export
// @access  Admin
exports.exportSubmissions = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const submissions = await Submission.find({ form: req.params.id });

    const fields = ['_id', 'submittedAt', ...form.fields.map(f => `answers.${f.name}`)];
    const csv = exportToCsv(submissions, fields);

    res.header('Content-Type', 'text/csv');
    res.attachment('submissions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
