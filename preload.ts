import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // Fetch all applications from SQLite
  getApplications: () => ipcRenderer.invoke('get-applications'),

  // Save a new application entry
  saveApplication: (data: any) => ipcRenderer.invoke('save-application', data),

  // Delete an application by ID
  deleteApplication: (id: string) => ipcRenderer.invoke('delete-application', id),

  // Update an existing application
  updateApplication: (data: any) => ipcRenderer.invoke('update-application', data),

  // 👇 NEW: File picker for resume
  pickResumeFile: () => ipcRenderer.invoke('pick-resume-file'),

  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
});
