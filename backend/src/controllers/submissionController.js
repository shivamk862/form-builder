
const Submission = require('../models/Submission');
const Form = require('../models/Form');
const { validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const { exportToCsv } = require('../utils/csvExporter');

// @desc    Submit a form
// @route   POST /api/forms/:id/submit
// @access  Public
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadFile = async (req, res, next) => {
  const formId = req.params.id;
  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    const fileField = form.fields.find(field => field.type === 'file');
    if (fileField) {
      const upload = multer({ storage: storage }).single(fileField.name);
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ message: err.message });
        } else if (err) {
          return res.status(500).json({ message: 'Unknown error uploading file' });
        }
        next();
      });
    } else {
      next(); // No file field, proceed without multer
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during file upload setup' });
  }
};

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
      if (field.type !== 'file') {
        let answer = req.body[field.name];
        if (answer) {
          answer = sanitizeHtml(answer);
          answers.set(field.name, answer);
        }
      }
    }

    const submission = new Submission({
      form: form._id,
      formVersion: form.version,
      answers,
    });

    if (req.file) {
      submission.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }

    await submission.save();
    res.status(201).json({ message: 'Form submitted successfully', submissionId: submission._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all submissions for a form
// @route   GET /api/admin/forms/:id/submissions
// @access  Admin
exports.getSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const query = { form: req.params.id };

    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        query[`answers.${key}`] = { $regex: filters[key], $options: 'i' };
      }
    }

    const submissions = await Submission.find(query)
      .select('_id submittedAt answers file.fileName file.contentType') // Explicitly select file metadata
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Submission.countDocuments(query);

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

    const flattenedSubmissions = submissions.map(submission => {
      const flatSubmission = {
        _id: submission._id,
        submittedAt: submission.submittedAt,
        ...Object.fromEntries(submission.answers), // Convert Map to plain object
      };
      if (submission.file) {
        flatSubmission.file = submission.file.fileName;
      }
      return flatSubmission;
    });

    const fields = ['_id', 'submittedAt', ...form.fields.filter(f => f.type !== 'file').map(f => f.name)];
    if (form.fields.some(f => f.type === 'file')) {
      fields.push('file');
    }

    const csv = exportToCsv(flattenedSubmissions, fields);

    res.header('Content-Type', 'text/csv');
    res.attachment('submissions.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubmissionFile = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission || !submission.file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', submission.file.contentType);
    res.set('Content-Disposition', `attachment; filename="${submission.file.fileName}"`);
    res.send(submission.file.data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
