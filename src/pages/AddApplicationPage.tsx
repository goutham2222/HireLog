import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobApplications } from '../hooks/useJobApplications';
import { ApplicationForm } from '../components/ApplicationForm';

export const AddApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addApplication } = useJobApplications();

  const handleSave = (data: any) => {
    addApplication(data);
    navigate('/');
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