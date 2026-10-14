import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { JobApplication } from '../types';
import { v4 as uuidv4 } from 'uuid';

const TEXT_KEYS = [
  'role',
  'jobTitle',
  'company',
  'resumeUsed',
  'appliedDate',
  'coverLetter',
  'jobUrl',
  'notes',
  'salaryRange',
  'location',
  'contactPerson',
  'followUpDate',
] as const;

function asText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

export function normalizeApplication(raw: JobApplication): JobApplication {
  const next = { ...raw };
  for (const key of TEXT_KEYS) {
    next[key] = asText(next[key]);
  }
  return {
    ...next,
    status: next.status || 'applied',
  };
}

interface ApplicationsContextValue {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  addApplication: (application: Omit<JobApplication, 'id'>) => Promise<void>;
  updateApplication: (application: JobApplication) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        if (!window.api?.getApplications) {
          throw new Error('Application storage is unavailable.');
        }
        const data = await window.api.getApplications();
        const normalized = (data ?? []).map(normalizeApplication);
        if (cancelled) return;
        setApplications(normalized);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load applications.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addApplication = async (application: Omit<JobApplication, 'id'>) => {
    const id = uuidv4();
    const newApp = normalizeApplication({ ...application, id } as JobApplication);
    const saved = normalizeApplication(await window.api.saveApplication(newApp));
    setApplications(prev => [...prev, saved]);
  };

  const updateApplication = async (application: JobApplication) => {
    const updated = normalizeApplication(await window.api.updateApplication(application));
    setApplications(prev => prev.map(app => (app.id === updated.id ? updated : app)));
  };

  const deleteApplication = async (id: string) => {
    await window.api.deleteApplication(id);
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        loading,
        error,
        addApplication,
        updateApplication,
        deleteApplication,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useJobApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useJobApplications must be used within ApplicationsProvider');
  }
  return context;
}
