// src/global.d.ts

import { JobApplication } from './types';

declare global {
  interface Window {
    api: {
      getApplications(): Promise<JobApplication[]>;
      saveApplication(app: JobApplication): Promise<JobApplication>;
      updateApplication(app: JobApplication): Promise<JobApplication>;
      deleteApplication(id: string): Promise<void>;
      exportApplications(format: 'json' | 'csv'): Promise<any>;
    };
  }
}

export {};
