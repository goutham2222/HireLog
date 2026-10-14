// src/global.d.ts

import { JobApplication } from './types';

declare global {
  interface Window {
    api: {
      getApplications(): Promise<JobApplication[]>;
      saveApplication(app: JobApplication): Promise<JobApplication>;
      updateApplication(app: JobApplication): Promise<JobApplication>;
      deleteApplication(id: string): Promise<{ changes: number }>;
      pickResumeFile: () => Promise<string>;
      openExternal(url: string): Promise<void>;
    };
  }
}

export {};
