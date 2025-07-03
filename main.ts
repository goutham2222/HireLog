console.log('[Main] Script loaded');

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';

// ✅ Use require for wait-on to avoid build errors with Rollup/Vite
const waitOn = require('wait-on');

let mainWindow: BrowserWindow | null = null;
let db: DatabaseType | null = null;

// === Initialize SQLite DB ===
const initDB = () => {
  const dbPath = path.join(app.getPath('userData'), 'applications.sqlite');
  db = new Database(dbPath);
  console.log('[Main] DB initialized at', dbPath);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      role TEXT,
      jobTitle TEXT,
      company TEXT,
      appliedDate TEXT,
      salaryRange TEXT,
      jobUrl TEXT,
      followUpDate TEXT,
      resumeUsed TEXT,
      status TEXT,
      location TEXT,
      contactPerson TEXT,
      coverLetter TEXT,
      notes TEXT
    )
  `).run();
};

// === Create Electron Window ===
const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devURL = process.env.VITE_DEV_SERVER_URL;

  try {
    if (devURL) {
      console.log('[Main] Loading URL:', devURL);
      await waitOn({ resources: [devURL], timeout: 10000 });
      await mainWindow.loadURL(devURL);
    } else {
      const indexPath = path.join(__dirname, '../dist-renderer/index.html');
      console.log('[Main] Loading file:', indexPath);
      await mainWindow.loadFile(indexPath);
    }
  } catch (err) {
    console.error('[Main] Failed to load window:', err);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// === CSV Helper ===
const toCSV = (data: Record<string, unknown>[]): string => {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};

// === IPC Handlers ===
ipcMain.handle('get-applications', () => {
  const stmt = db!.prepare('SELECT * FROM applications ORDER BY appliedDate DESC');
  return stmt.all();
});

ipcMain.on('save-application', (_event, appData) => {
  const id = Date.now().toString();
  const stmt = db!.prepare(`
    INSERT INTO applications (
      id, role, jobTitle, company, appliedDate, salaryRange, jobUrl,
      followUpDate, resumeUsed, status, location,
      contactPerson, coverLetter, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    appData.role, appData.jobTitle, appData.company, appData.appliedDate, appData.salaryRange,
    appData.jobUrl, appData.followUpDate, appData.resumeUsed, appData.status,
    appData.location, appData.contactPerson, appData.coverLetter, appData.notes
  );
});

ipcMain.on('delete-application', (_event, id: string) => {
  db!.prepare('DELETE FROM applications WHERE id = ?').run(id);
});

ipcMain.on('update-application', (_event, appData) => {
  const {
    id, role, jobTitle, company, appliedDate, salaryRange, jobUrl,
    followUpDate, resumeUsed, status, location,
    contactPerson, coverLetter, notes
  } = appData;

  db!.prepare(`
    UPDATE applications SET
      role = ?, jobTitle = ?, company = ?, appliedDate = ?, salaryRange = ?, jobUrl = ?,
      followUpDate = ?, resumeUsed = ?, status = ?, location = ?,
      contactPerson = ?, coverLetter = ?, notes = ?
    WHERE id = ?
  `).run(
    role, jobTitle, company, appliedDate, salaryRange, jobUrl,
    followUpDate, resumeUsed, status, location,
    contactPerson, coverLetter, notes, id
  );
});

ipcMain.handle('export-applications', async (_event, format: 'json' | 'csv') => {
  const apps = db!.prepare('SELECT * FROM applications').all() as Record<string, unknown>[];

  const saveResult = await dialog.showSaveDialog({
    title: `Export as ${format.toUpperCase()}`,
    defaultPath: `job-applications.${format}`,
    filters: [
      { name: 'JSON', extensions: ['json'] },
      { name: 'CSV', extensions: ['csv'] }
    ]
  });

  // Electron's showSaveDialog returns an object with filePath (older) or filePath (newer)
  const filePath = (saveResult as any).filePath ?? (saveResult as any).filePath;
  const canceled = (saveResult as any).canceled ?? false;

  if (canceled || !filePath) {
    return { success: false };
  }

  try {
    const content = format === 'csv'
      ? toCSV(apps)
      : JSON.stringify(apps, null, 2);

    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, path: filePath };
  } catch (error) {
    console.error('[Main] Failed to save exported file:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
});

// === App Lifecycle ===
async function start() {
  console.log('[Main] start() called');
  await app.whenReady();
  console.log('[Main] app ready');

  try {
    initDB();
  } catch (err) {
    console.error('[Main] DB init failed:', err);
  }

  await createWindow();
  console.log('[Main] Window creation triggered');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

start();
export default start;
