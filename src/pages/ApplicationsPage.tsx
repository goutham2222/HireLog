import React, { useState } from 'react';
import { ApplicationForm } from '../components/ApplicationForm';
import { ApplicationCard } from '../components/ApplicationCard';
import { JobApplication, ApplicationStatus } from '../types';
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
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const handleAddClick = () => {
    setSelectedApplication(null);
    setIsModalOpen(true);
  };

  const handleEdit = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => deleteApplication(id);

  const handleSave = async (data: Omit<JobApplication, 'id'>) => {
    if (selectedApplication) {
      const updated: JobApplication = { ...selectedApplication, ...data };
      await updateApplication(updated);
    } else {
      await addApplication(data);
    }
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Applications</h1>
        <button onClick={handleAddClick} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
          + Add Application
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => exportApplications('json')} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
          Export JSON
        </button>
        <button onClick={() => exportApplications('csv')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applications.length === 0 ? (
          <div className="text-gray-500 text-center col-span-full mt-8">No applications yet. Add your first application!</div>
        ) : (
          applications.map(application => (
            <ApplicationCard
              key={application.id}
              application={application}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={(id, status) =>
                updateApplication({ ...application, status: status as ApplicationStatus })
              }
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6">
            <ApplicationForm application={selectedApplication ?? undefined} onSave={handleSave} onCancel={handleCancel} />
          </div>
        </div>
      )}
    </div>
  );
};
