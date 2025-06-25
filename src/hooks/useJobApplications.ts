import { useState, useEffect } from 'react';
import { JobApplication } from '../types';

const STORAGE_KEY = 'job-applications';

export const useJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApplications(JSON.parse(stored));
    }
  }, []);

  const saveApplications = (apps: JobApplication[]) => {
    setApplications(apps);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  };

  const addApplication = (application: Omit<JobApplication, 'id'>) => {
    const newApp: JobApplication = {
      ...application,
      id: Date.now().toString(),
    };
    saveApplications([...applications, newApp]);
  };

  const updateApplication = (id: string, updates: Partial<JobApplication>) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, ...updates } : app
    );
    saveApplications(updated);
  };

  const deleteApplication = (id: string) => {
    const filtered = applications.filter(app => app.id !== id);
    saveApplications(filtered);
  };

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
  };
};