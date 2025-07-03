import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getApplications: () => ipcRenderer.invoke('get-applications'),
  saveApplication: (data: any) => ipcRenderer.send('save-application', data),
  deleteApplication: (id: string) => ipcRenderer.send('delete-application', id),
  updateApplication: (data: any) => ipcRenderer.send('update-application', data),
  exportApplications: (format: 'json' | 'csv') => ipcRenderer.invoke('export-applications', format),
});
