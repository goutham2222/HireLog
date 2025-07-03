import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationForm } from '../components/ApplicationForm';
import { useJobApplications } from '../hooks/useJobApplications';
import { JobApplication } from '../types';

export const AddApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addApplication } = useJobApplications();

  const handleSave = async (data: Omit<JobApplication, 'id'>) => {
    console.log('[AddApplicationPage] handleSave received:', data);
    // Ensure all string fields are always a string (never undefined)
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ApplicationForm onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};
