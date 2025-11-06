import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForms } from '../services/api';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const { data: forms, isLoading, isError } = useQuery({ queryKey: ['forms'], queryFn: getForms });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching forms</div>;
  }

  return (
    <div className="container">
      <h1>Available Forms</h1>
      <div className="form-list">
        {forms.map((form: any) => (
          <div key={form._id} className="card">
            <h2>{form.title}</h2>
            <p>{form.description}</p>
            <Link to={`/forms/${form._id}`} className="btn btn-primary">Fill out form</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
