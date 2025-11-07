import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getFormById, submitForm } from '../services/api';
import { useForm } from 'react-hook-form';
import FieldRenderer from '../components/FieldRenderer';
import './UserForm.css';

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { data: form, isLoading, isError } = useQuery({
    queryKey: ['form', id],
    queryFn: () => getFormById(id!),
  });

  const submitFormMutation = useMutation({
    mutationFn: (answers: any) => submitForm(id!, answers),
    onSuccess: () => {
      alert('Form submitted successfully!');
      navigate('/');
    },
    onError: () => {
      alert('Error submitting form!');
    }
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    const fileField = form?.fields.find((field: any) => field.type === 'file');

    for (const key in data) {
      if (fileField && key === fileField.name) {
        // Append the file using its actual field name
        if (data[key] && data[key][0]) {
          formData.append(fileField.name, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    submitFormMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching form</div>;
  }

  const hasFileField = form?.fields.some((field: any) => field.type === 'file');

  return (
    <div className="container">
      <div className="user-form card">
        <h1>{form.title}</h1>
        <p>{form.description}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {form.fields.sort((a: any, b: any) => a.order - b.order).map((field: any) => (
            <FieldRenderer key={field.name} field={field} register={register} />
          ))}
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;