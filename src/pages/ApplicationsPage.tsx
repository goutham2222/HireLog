import React, { useState } from 'react';
import { ApplicationForm } from '../components/ApplicationForm';
import { JobApplication } from '../types';
import { useJobApplications } from '../hooks/useJobApplications';

export const ApplicationsPage: React.FC = () => {
  const {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    exportApplications,
  } = useJobApplications();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const selectedApplication = applications.find(app => app.id === selectedApplicationId) || null;

  const handleEditClick = () => {
    if (selectedApplicationId) {
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = () => {
    if (selectedApplicationId && confirm("Are you sure you want to delete this application?")) {
      deleteApplication(selectedApplicationId);
      setSelectedApplicationId(null);
    }
  };

  const handleSave = async (data: Omit<JobApplication, 'id'>) => {
    if (selectedApplication) {
      const updated: JobApplication = { ...selectedApplication, ...data };
      await updateApplication(updated);
    } else {
      await addApplication(data);
    }
    setIsModalOpen(false);
    setSelectedApplicationId(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedApplicationId(null);
  };

    return (
  <div className="flex flex-col h-full w-full p-6 bg-gray-50">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
      <div className="flex gap-4">
        <button
          disabled={!selectedApplicationId}
          onClick={handleEditClick}
          className={`px-4 py-2 rounded-md text-white ${
            selectedApplicationId
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Edit
        </button>
        <button
          disabled={!selectedApplicationId}
          onClick={handleDeleteClick}
          className={`px-4 py-2 rounded-md text-white ${
            selectedApplicationId
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Delete
        </button>
      </div>
    </div>

    <div className="flex gap-4 mb-4">
      <button
        onClick={() => exportApplications('json')}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
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

    <div className="flex-1 overflow-y-auto border rounded-lg shadow bg-white">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-4 py-3 w-12">Select</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Applied Date</th>
            <th className="px-4 py-3 text-left">Salary</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-6">
                No applications found.
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => setSelectedApplicationId(app.id)}
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  selectedApplicationId === app.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-4 py-3 text-center">
                  <input
                    type="radio"
                    name="selectedApp"
                    checked={selectedApplicationId === app.id}
                    onChange={() => setSelectedApplicationId(app.id)}
                  />
                </td>
                <td className="px-4 py-3">{app.role}</td>
                <td className="px-4 py-3">{app.company}</td>
                <td className="px-4 py-3">{app.appliedDate}</td>
                <td className="px-4 py-3">{app.salaryRange || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {isModalOpen && selectedApplication && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
          <ApplicationForm
            application={selectedApplication}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    )}
  </div>
);

};
