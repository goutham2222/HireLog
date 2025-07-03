import { useEffect, useState } from 'react';

export interface JobApplication {
  id: string;
  role: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  salaryRange: string;
  jobUrl: string;
  followUpDate: string;
  resumeUsed: string;
  status: string;
  location: string;
  contactPerson: string;
  coverLetter: string;
  notes: string;
}

declare global {
  interface Window {
    api: {
      getApplications: () => Promise<JobApplication[]>;
      saveApplication: (app: Omit<JobApplication, 'id'>) => void;
      deleteApplication: (id: string) => void;
      updateApplication: (app: JobApplication) => void;
      exportApplications: (format: 'json' | 'csv') => Promise<{ success: boolean; path?: string }>;
    };
  }
}

export function useJobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const loadApplications = async () => {
    const apps = await window.api.getApplications();
    setApplications(apps);
  };

  const addApplication = (appData: Omit<JobApplication, 'id'>) => {
    console.log('[AddApplicationPage] handleSave received:', appData);
    window.api.saveApplication(appData);
    loadApplications();
  };

  const deleteApplication = (id: string) => {
    window.api.deleteApplication(id);
    loadApplications();
  };

  const updateApplication = (appData: JobApplication) => {
    window.api.updateApplication(appData);
    loadApplications();
  };

  const exportApplications = async (format: 'json' | 'csv') => {
    const result = await window.api.exportApplications(format);
    return result;
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return {
    applications,
    addApplication,
    deleteApplication,
    updateApplication,
    exportApplications,
  };
}
