import React from 'react';
import { useJobApplications } from '../hooks/useJobApplications';

export const ApplicationsPage: React.FC = () => {
  const {
    applications,
    deleteApplication,
    exportApplications,
  } = useJobApplications();

  return (
    <div className="max-w-4xl mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Job Applications</h1>

      {/* ✅ Export Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => exportApplications('json')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export JSON
        </button>
        <button
          onClick={() => exportApplications('csv')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Your existing application list / table here */}
      <div className="bg-white shadow rounded p-4">
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <ul className="space-y-2">
            {applications.map(app => (
              <li key={app.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <strong>{app.jobTitle}</strong> at <em>{app.company}</em>
                </div>
                <button
                  onClick={() => deleteApplication(app.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
