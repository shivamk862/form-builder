import React from 'react';
import './FieldRenderer.css';

interface Field {
  label: string;
  type: string;
  name: string;
  options: string[];
}

interface FieldRendererProps {
  field: Field;
  register: any;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, register }) => {
  switch (field.type) {
    case 'text':
    case 'number':
    case 'email':
    case 'date':
      return (
        <div className="form-group">
          <label>{field.label}</label>
          <input
            type={field.type}
            {...register(field.name)}
            className="form-control"
          />
        </div>
      );
    case 'textarea':
      return (
        <div className="form-group">
          <label>{field.label}</label>
          <textarea
            {...register(field.name)}
            rows={3}
            className="form-control"
          />
        </div>
      );
    case 'select':
      return (
        <div className="form-group">
          <label>{field.label}</label>
          <select
            {...register(field.name)}
            className="form-control"
          >
            {field.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    case 'radio':
      return (
        <div className="form-group">
          <label>{field.label}</label>
          {field.options.map((option) => (
            <div key={option} className="radio-option">
              <input
                type="radio"
                value={option}
                {...register(field.name)}
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <div className="form-group-checkbox">
          <input
            type="checkbox"
            {...register(field.name)}
          />
          <label>{field.label}</label>
        </div>
      );
    case 'file':
      return (
        <div className="form-group">
          <label>{field.label}</label>
          <input
            type="file"
            {...register(field.name)}
          />
        </div>
      );
    default:
      return null;
  }
};

export default FieldRenderer;