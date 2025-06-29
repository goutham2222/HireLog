import { useState, useEffect } from 'react';
import { JobApplication } from '../types';

declare global {
  interface Window {
    electronAPI?: {
      getApplications: () => Promise<JobApplication[]>;
      addApplication: (app: JobApplication) => Promise<{ success: boolean; error?: string }>;
      updateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>;
      deleteApplication: (id: string) => Promise<void>;
    };
  }
}

export function useJobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const loadApplications = async () => {
    try {
      if (!window.electronAPI?.getApplications) {
        console.warn('[hook] Electron API not available');
        return;
      }

      const data = await window.electronAPI.getApplications();
      console.log('[hook] Loaded applications:', data);
      setApplications(data);
    } catch (error) {
      console.error('[hook] Failed to load applications:', error);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const addApplication = async (app: Omit<JobApplication, 'id'>) => {
    const newApp: JobApplication = {
      ...app,
      id: Date.now().toString(),
    };

    try {
      console.log('[hook] Adding application:', newApp);
      const result = await window.electronAPI?.addApplication(newApp);
      console.log('[hook] Result from preload:', result);

      if (result?.success) {
        await loadApplications();
      } else {
        console.error('[hook] Failed to save application:', result?.error);
      }
    } catch (error) {
      console.error('[hook] Error during addApplication:', error);
    }
  };

  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    try {
      await window.electronAPI?.updateApplication(id, updates);
      await loadApplications();
    } catch (error) {
      console.error('[hook] Error updating application:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      await window.electronAPI?.deleteApplication(id);
      await loadApplications();
    } catch (error) {
      console.error('[hook] Error deleting application:', error);
    }
  };

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
  };
}
