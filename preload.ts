import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getApplications: () => ipcRenderer.invoke('get-applications'),
  saveApplication: (data: any) => ipcRenderer.invoke('save-application', data), // ✅ return value
  deleteApplication: (id: string) => ipcRenderer.send('delete-application', id),
  updateApplication: (data: any) => ipcRenderer.invoke('update-application', data), // ✅ should return updated
  exportApplications: (format: 'json' | 'csv') => ipcRenderer.invoke('export-applications', format),
});
