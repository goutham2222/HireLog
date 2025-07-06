// src/hooks/useJobApplications.ts
import { useEffect, useState } from 'react';
import { JobApplication } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    window.api.getApplications().then(data => {
      setApplications(data);
    });
  }, []);

  const addApplication = async (
    application: Omit<JobApplication, 'id'>
  ) => {
    const newApp: JobApplication = { id: uuidv4(), ...application };
    const saved: JobApplication = await window.api.saveApplication(newApp);
    setApplications(prev => [...prev, saved]);
  };

  const updateApplication = async (application: JobApplication) => {
    const updated: JobApplication = await window.api.updateApplication(application);
    setApplications(prev =>
      prev.map(app => (app.id === updated.id ? updated : app))
    );
  };

  const deleteApplication = async (id: string) => {
    await window.api.deleteApplication(id);
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const exportApplications = async (format: 'csv' | 'json') => {
    const data =
      format === 'json'
        ? JSON.stringify(applications, null, 2)
        : [
            ['ID', 'Role', 'Company', 'Status', 'AppliedDate'],
            ...applications.map(a => [
              a.id,
              a.role,
              a.company,
              a.status,
              a.appliedDate,
            ]),
          ]
            .map(row => row.join(','))
            .join('\n');

    const blob = new Blob([data], {
      type: format === 'json' ? 'application/json' : 'text/csv',
    });

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
