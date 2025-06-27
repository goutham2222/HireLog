import { useState, useEffect } from 'react';
import { JobApplication } from '../types';

interface IPCResponse {
  success: boolean;
  data?: Array<Partial<JobApplication> & { id: string }>;
  error?: string;
}

export const useJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        const result = await (window as any).api.getApplications();
        if (result.success && Array.isArray(result.data)) {
          const validApplications = result.data.map((app: Partial<JobApplication> & { id: string }) => {
            const baseApp: JobApplication = {
              id: app.id || Date.now().toString(),
              role: app.role || '',
              jobTitle: app.jobTitle || '',
              company: app.company || '',
              resumeUsed: app.resumeUsed || '',
              appliedDate: app.appliedDate || new Date().toISOString().split('T')[0],
              status: app.status || 'applied',
              coverLetter: app.coverLetter || '',
              jobUrl: app.jobUrl || '',
              notes: app.notes || '',
              salary: app.salary || '',
              location: app.location || '',
              contactPerson: app.contactPerson || '',
              followUpDate: app.followUpDate || '',
            };
            return baseApp;
          });
          setApplications(validApplications);
        } else {
          setError(result.error || 'Failed to load applications');
          console.error('Failed to load applications:', result.error);
        }
      } catch (error) {
        setError('Error loading applications');
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  const saveApplication = async (application: Omit<JobApplication, 'id'>) => {
    try {
      const newApp: JobApplication = {
        ...application,
        id: Date.now().toString(),
      };
      const result = await (window as any).api.saveApplication(newApp);
      if (result.success) {
        setApplications(prev => [...prev.filter(app => app.id !== newApp.id), newApp]);
        setError(null);
      } else {
        setError(result.error || 'Failed to save application');
        console.error('Failed to save application:', result.error);
      }
    } catch (error) {
      setError('Error saving application');
      console.error('Error saving application:', error);
    }
  };

  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    try {
      const result = await (window as any).api.updateApplication(id, updates);
      if (result.success) {
        setApplications(prev =>
          prev.map(app => (app.id === id ? { ...app, ...updates } : app))
        );
        setError(null);
      } else {
        setError(result.error || 'Failed to update application');
        console.error('Failed to update application:', result.error);
      }
    } catch (error) {
      setError('Error updating application');
      console.error('Error updating application:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const result = await (window as any).api.deleteApplication(id);
      if (result.success) {
        setApplications(prev => prev.filter(app => app.id !== id));
        setError(null);
      } else {
        setError(result.error || 'Failed to delete application');
        console.error('Failed to delete application:', result.error);
      }
    } catch (error) {
      setError('Error deleting application');
      console.error('Error deleting application:', error);
    }
  };

  return {
    applications,
    loading,
    error,
    addApplication: saveApplication,
    updateApplication,
    deleteApplication,
  };
};