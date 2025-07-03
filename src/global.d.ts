export {};

declare global {
  interface Window {
    api: {
      getApplications: () => Promise<any[]>;
      saveApplication: (data: any) => void;
      deleteApplication: (id: string) => void;
      updateApplication: (data: any) => void;
      exportApplications: (format: 'json' | 'csv') => Promise<{ success: boolean; path?: string; error?: string }>;
    };
  }
}
