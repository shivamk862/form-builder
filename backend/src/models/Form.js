
const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'textarea', 'number', 'email', 'date', 'checkbox', 'radio', 'select', 'file'],
    required: true,
  },
  name: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
  validation: {
    min: { type: Number },
    max: { type: Number },
    regex: { type: String },
  },
  order: { type: Number, required: true },
  conditional: {
    field: { type: String },
    value: { type: String },
  },
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fields: [FieldSchema],
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FormSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Form', FormSchema);
