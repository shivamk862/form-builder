import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubmissions, exportSubmissions, getSubmissionFile, getFormById } from '../services/api';
import './Submissions.css';

const Submissions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const { data: submissionsData, isLoading: isLoadingSubmissions, isError: isErrorSubmissions } = useQuery({
    queryKey: ['submissions', id, page, filters],
    queryFn: () => getSubmissions(id!, page, filters),
  });

  const { data: formData, isLoading: isLoadingForm, isError: isErrorForm } = useQuery({
    queryKey: ['form', id],
    queryFn: () => getFormById(id!),
    enabled: !!id, // Only run this query if id is available
  });

  const submissions = submissionsData?.submissions || [];
  const totalPages = submissionsData?.totalPages || 1;
  const formFields = formData?.fields || [];

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

  const handlePreview = (submission: any) => {
    setSelectedSubmission(submission);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setSelectedSubmission(null);
    setShowPreview(false);
  };

  if (isLoadingSubmissions || isLoadingForm) {
    return <div>Loading...</div>;
  }

  if (isErrorSubmissions || isErrorForm) {
    return <div>Error fetching data</div>;
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
                <th>Submitted At</th>
                <th>Email</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission: any) => (
                <tr key={submission._id}>
                  <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                  <td>{submission.answers.email || '-'}</td>
                  <td>
                    {submission.file && (
                      <button onClick={() => handleDownload(submission._id, submission.file.fileName)} className="btn btn-secondary">{submission.file.fileName}</button>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handlePreview(submission)} className="btn btn-primary">Preview</button>
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

      {showPreview && selectedSubmission && (
        <div className="submission-preview-overlay">
          <div className="submission-preview-content">
            <h2>Submission Details</h2>
            <p><strong>Submitted At:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
            {formFields.map((field: any) => (
              <p key={field.name}>
                <strong>{field.label}:</strong> 
                {(typeof selectedSubmission.answers[field.name] === 'object' && selectedSubmission.answers[field.name] !== null)
                  ? JSON.stringify(selectedSubmission.answers[field.name])
                  : selectedSubmission.answers[field.name] || '-'}
              </p>
            ))}
            {selectedSubmission.file && (
              <p>
                <strong>File:</strong> 
                <button onClick={() => handleDownload(selectedSubmission._id, selectedSubmission.file.fileName)} className="btn btn-secondary">{selectedSubmission.file.fileName}</button>
              </p>
            )}
            <button onClick={handleClosePreview} className="btn btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;