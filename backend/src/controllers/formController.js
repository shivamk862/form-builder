
const Form = require('../models/Form');

// @desc    Get all forms
// @route   GET /api/forms
// @access  Public
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find().select('-fields');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get form by ID
// @route   GET /api/forms/:id
// @access  Public
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new form
// @route   POST /api/admin/forms
// @access  Admin
exports.createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const newForm = new Form({ title, description, fields });
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a form
// @route   PUT /api/admin/forms/:id
// @access  Admin
exports.updateForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.title = title;
    form.description = description;
    form.fields = fields;
    form.version += 1;

    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a form
// @route   DELETE /api/admin/forms/:id
// @access  Admin
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    await Form.deleteOne({ _id: req.params.id });
    res.json({ message: 'Form removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a field to a form
// @route   POST /api/admin/forms/:id/fields
// @access  Admin
exports.addField = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.fields.push(req.body);
    form.version += 1;
    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a field in a form
// @route   PUT /api/admin/forms/:id/fields/:fieldId
// @access  Admin
exports.updateField = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const field = form.fields.id(req.params.fieldId);

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    Object.assign(field, req.body);
    form.version += 1;
    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a field from a form
// @route   DELETE /api/admin/forms/:id/fields/:fieldId
// @access  Admin
exports.deleteField = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const field = form.fields.id(req.params.fieldId);

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    field.remove();
    form.version += 1;
    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
