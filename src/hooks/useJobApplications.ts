import { useEffect, useState } from 'react';

export interface JobApplication {
  id: string;
  role: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  jobUrl: string;
  followUpDate: string;
  resumeUsed: string;
  status: string;
  location: string;
  contactPerson: string;
  coverLetter: string;
  notes: string;
}

export const useJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const loadApplications = async () => {
    const apps = await window.api.getApplications();
    setApplications(apps);
  };

  const addApplication = async (app: Omit<JobApplication, 'id'>) => {
    window.api.saveApplication(app);
    await loadApplications();
  };

  const deleteApplication = async (id: string) => {
    window.api.deleteApplication(id);
    await loadApplications();
  };

  const updateApplication = async (app: JobApplication) => {
    window.api.updateApplication(app);
    await loadApplications();
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return {
    applications,
    addApplication,
    deleteApplication,
    updateApplication,
  };
};
