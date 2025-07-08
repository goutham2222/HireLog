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

  const exportApplications = async (
    format: 'csv' | 'json',
    exportData?: JobApplication[]
  ) => {
    const dataToExport = exportData ?? applications;

    if (dataToExport.length === 0) {
      alert('No applications to export.');
      return;
    }

    let data: string;

    if (format === 'json') {
      data = JSON.stringify(dataToExport, null, 2);
    } else {
      // CSV Header
      const headers = Object.keys(dataToExport[0]);
      const rows = dataToExport.map(app =>
        headers.map(key => {
          const value = (app as any)[key];
          return `"${(value ?? '').toString().replace(/"/g, '""')}"`;
        }).join(',')
      );
      data = [headers.join(','), ...rows].join('\n');
    }

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
