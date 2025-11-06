import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubmissions, exportSubmissions } from '../services/api';
import './Submissions.css';

const Submissions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['submissions', id],
    queryFn: () => getSubmissions(id!),
  });

  const submissions = data?.submissions || [];

  const handleExport = async () => {
    const data = await exportSubmissions(id!);
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `submissions-${id}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching submissions</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Submissions</h1>
        <button onClick={handleExport} className="btn btn-secondary">Export as CSV</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {submissions.length > 0 && Object.keys(submissions[0].answers).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission: any) => (
              <tr key={submission._id}>
                {Object.values(submission.answers).map((value: any, index) => (
                  <td key={index}>{value}</td>
                ))}
                <td>{new Date(submission.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Submissions;