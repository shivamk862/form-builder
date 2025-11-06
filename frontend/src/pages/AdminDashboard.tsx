import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getForms, deleteForm } from '../services/api';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: forms, isLoading, isError } = useQuery({ queryKey: ['forms'], queryFn: getForms });

  const deleteFormMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });

  const handleDelete = (id: string) => {
    console.log('Deleting form with id:', id);
    if (window.confirm('Are you sure you want to delete this form?')) {
      deleteFormMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching forms</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/forms/new/builder" className="btn btn-primary">Create Form</Link>
      </div>
      <div className="form-list">
        {forms.map((form: any) => (
          <div key={form._id} className="card">
            <h2>{form.title}</h2>
            <p>{form.description}</p>
            <p className="version">Version: {form.version}</p>
            <div className="actions">
              <Link to={`/admin/forms/${form._id}/builder`} className="btn btn-secondary">Edit</Link>
              <Link to={`/admin/forms/${form._id}/submissions`} className="btn btn-secondary">View Submissions</Link>
              <button onClick={() => handleDelete(form._id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;