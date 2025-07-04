import { useState } from 'react';
import { JobApplication } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const addApplication = async (application: Omit<JobApplication, 'id'>): Promise<void> => {
    const newApp: JobApplication = { id: uuidv4(), ...application };
    setApplications(prev => [...prev, newApp]);
  };

  const updateApplication = async (application: JobApplication): Promise<void> => {
    setApplications(prev => prev.map(app => (app.id === application.id ? application : app)));
  };

  const deleteApplication = async (id: string): Promise<void> => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const exportApplications = async (format: 'csv' | 'json'): Promise<void> => {
    const data = format === 'json'
      ? JSON.stringify(applications, null, 2)
      : [
          ['ID', 'Role', 'Company', 'Status', 'AppliedDate'],
          ...applications.map(a => [a.id, a.role, a.company, a.status, a.appliedDate]),
        ]
            .map(row => row.join(','))
            .join('\n');

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applications.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    exportApplications,
  };
};
