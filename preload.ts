import { contextBridge, ipcRenderer } from 'electron';
import { v4 as uuidv4 } from 'uuid';

contextBridge.exposeInMainWorld('electronAPI', {
  getApplications: () => {
    console.log('[preload] Invoking get-applications');
    return ipcRenderer.invoke('get-applications');
  },

  addApplication: (application) => {
    const id = uuidv4();
    const payload = { id, ...application };
    console.log('[preload] Sending saveApplication:', payload);
    return ipcRenderer.invoke('saveApplication', payload);
  },

  updateApplication: (id, updates) => {
    console.log('[preload] Sending update-application:', id, updates);
    return ipcRenderer.invoke('update-application', id, updates);
  },

  deleteApplication: (id) => {
    console.log('[preload] Sending delete-application:', id);
    return ipcRenderer.invoke('delete-application', id);
  },
});
