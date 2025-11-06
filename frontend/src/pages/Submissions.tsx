import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubmissions, exportSubmissions, getSubmissionFile } from '../services/api';
import './Submissions.css';

const Submissions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ['submissions', id, page, filters],
    queryFn: () => getSubmissions(id!, page, filters),
  });

  const submissions = data?.submissions || [];
  const totalPages = data?.totalPages || 1;

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleExport = async () => {
    const data = await exportSubmissions(id!);
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `submissions-${id}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleDownload = async (submissionId: string, fileName: string) => {
    const data = await getSubmissionFile(submissionId);
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
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
        {submissions.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(submissions[0].answers).map((key) => (
                  <th key={key}>
                    {key}
                    <input
                      type="text"
                      placeholder={`Filter by ${key}`}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      className="filter-input"
                    />
                  </th>
                ))}
                <th>Submitted At</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission: any) => (
                <tr key={submission._id}>
                  {Object.values(submission.answers).map((value: any, index) => (
                    <td key={index}>{value}</td>
                  ))}
                  <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                  <td>
                    {submission.file && (
                      <button onClick={() => handleDownload(submission._id, submission.file.fileName)} className="btn btn-secondary">{submission.file.fileName}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No submissions yet.</p>
        )}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default Submissions;