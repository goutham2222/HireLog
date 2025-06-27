import { contextBridge, ipcRenderer } from 'electron';

  contextBridge.exposeInMainWorld('api', {
    saveApplication: (application: any) => ipcRenderer.invoke('save-application', application),
    getApplications: () => ipcRenderer.invoke('get-applications'),
    updateApplication: (id: string, updates: any) => ipcRenderer.invoke('update-application', id, updates),
    deleteApplication: (id: string) => ipcRenderer.invoke('delete-application', id),
  });