
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  formVersion: { type: Number, required: true },
  answers: { type: Map, of: mongoose.Schema.Types.Mixed },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', SubmissionSchema);
