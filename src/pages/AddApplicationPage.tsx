import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobApplications } from '../hooks/useJobApplications';
import { JobApplication } from '../types';

export const AddApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addApplication } = useJobApplications();

  const handleSave = async (data: Omit<JobApplication, 'id'>) => {
    const safeData = {
      ...data,
      id: Date.now().toString(),
      jobUrl: data.jobUrl ?? '',
      followUpDate: data.followUpDate ?? '',
      location: data.location ?? '',
      contactPerson: data.contactPerson ?? '',
      coverLetter: data.coverLetter ?? '',
      notes: data.notes ?? '',
    };
    await addApplication(safeData);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen h-full overflow-y-auto bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <ApplicationForm onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
};
