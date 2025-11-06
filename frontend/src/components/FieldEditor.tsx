import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './FieldEditor.css';

interface Field {
  label: string;
  type: string;
  name: string;
  options: string[];
  required: boolean;
  validation: {
    min?: number;
    max?: number;
    regex?: string;
  };
  order: number;
}

interface FieldEditorProps {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ fields, setFields }) => {
  const addField = () => {
    setFields([...fields, { label: '', type: 'text', name: '', options: [], required: false, validation: {}, order: fields.length }]);
  };

  const handleFieldChange = (index: number, field: Partial<Field>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...field };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields.map((field, index) => ({ ...field, order: index })));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newFields = Array.from(fields);
    const [reorderedItem] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, reorderedItem);

    setFields(newFields.map((field, index) => ({ ...field, order: index })));
  };

  return (
    <div className="field-editor">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((field, index) => (
                <Draggable key={index} draggableId={`field-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="field-card"
                    >
                      <div className="field-inputs">
                        <div className="form-group">
                          <label>Label</label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => handleFieldChange(index, { label: e.target.value })}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => handleFieldChange(index, { name: e.target.value })}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Type</label>
                          <select
                            value={field.type}
                            onChange={(e) => handleFieldChange(index, { type: e.target.value })}
                            className="form-control"
                          >
                            <option value="text">Text</option>
                            <option value="textarea">Textarea</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="date">Date</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="radio">Radio</option>
                            <option value="select">Select</option>
                            <option value="file">File</option>
                          </select>
                        </div>
                        <div className="form-group-checkbox">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleFieldChange(index, { required: e.target.checked })}
                          />
                          <label>Required</label>
                        </div>
                        {['select', 'radio', 'checkbox'].includes(field.type) && (
                          <div className="form-group">
                            <label>Options (comma-separated)</label>
                            <input
                              type="text"
                              value={field.options.join(',')}
                              onChange={(e) => handleFieldChange(index, { options: e.target.value.split(',') })}
                              className="form-control"
                            />
                          </div>
                        )}
                        {field.type === 'number' && (
                          <>
                            <div className="form-group">
                              <label>Min</label>
                              <input
                                type="number"
                                value={field.validation?.min || ''}
                                onChange={(e) => handleFieldChange(index, { validation: { ...field.validation, min: Number(e.target.value) } })}
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label>Max</label>
                              <input
                                type="number"
                                value={field.validation?.max || ''}
                                onChange={(e) => handleFieldChange(index, { validation: { ...field.validation, max: Number(e.target.value) } })}
                                className="form-control"
                              />
                            </div>
                          </>
                        )}
                        {field.type === 'text' && (
                          <div className="form-group">
                            <label>Regex</label>
                            <input
                              type="text"
                              value={field.validation?.regex || ''}
                              onChange={(e) => handleFieldChange(index, { validation: { ...field.validation, regex: e.target.value } })}
                              className="form-control"
                            />
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeField(index)} className="btn btn-danger">Remove</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={addField} className="btn btn-secondary">Add Field</button>
    </div>
  );
};

export default FieldEditor;