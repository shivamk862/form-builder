
const Form = require('../models/Form');


exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find().select('-fields');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

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
