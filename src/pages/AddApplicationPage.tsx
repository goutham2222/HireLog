import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobApplications } from '../hooks/useJobApplications';
import { ApplicationForm } from '../components/ApplicationForm';
import { JobApplication } from '../types';

export const AddApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addApplication } = useJobApplications();

  const handleSave = async (data: Omit<JobApplication, 'id'>) => {
    console.log('[AddApplicationPage] handleSave received:', data);
    await addApplication(data); // ✅ wait until saved
    navigate('/');              // ✅ navigate only after save
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ApplicationForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};
