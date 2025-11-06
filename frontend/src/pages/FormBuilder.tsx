import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFormById, createForm, updateForm } from '../services/api';
import FieldEditor from '../components/FieldEditor';
import './FormBuilder.css';

const FormBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<any[]>([]);

  const isNewForm = id === 'new';

  const { data: form, isLoading } = useQuery({
    queryKey: ['form', id],
    queryFn: () => getFormById(id!),
    enabled: !isNewForm,
  });

  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setDescription(form.description);
      setFields(form.fields);
    }
  }, [form]);

  const createFormMutation = useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      navigate('/');
    },
  });

  const updateFormMutation = useMutation({
    mutationFn: (updatedForm: any) => updateForm(id!, updatedForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['form', id] });
      navigate('/');
    },
  });

  const handleSave = () => {
    const formPayload = { title, description, fields };
    if (isNewForm) {
      createFormMutation.mutate(formPayload);
    } else {
      updateFormMutation.mutate(formPayload);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>{isNewForm ? 'Create Form' : 'Edit Form'}</h1>
        <button onClick={handleSave} className="btn btn-primary">Save Form</button>
      </div>
      <div className="form-builder">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="form-control"
          />
        </div>
        <div>
          <h2>Fields</h2>
          <FieldEditor fields={fields} setFields={setFields} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;