import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';

let mainWindow: BrowserWindow | null = null;
let db: DatabaseType | null = null;

const initDB = () => {
  const dbPath = path.join(app.getPath('userData'), 'applications.sqlite');
  db = new Database(dbPath);
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

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: path.resolve(__dirname, '../../../dist/preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow!.webContents.setZoomFactor(1.1);
    mainWindow!.webContents.setVisualZoomLevelLimits(1, 1);
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    //mainWindow.webContents.openDevTools(); // optional: opens DevTools
  } else {
    const indexPath = path.join(__dirname, '../dist-renderer/index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

ipcMain.handle('get-applications', () => {
  return db!.prepare('SELECT * FROM applications ORDER BY appliedDate DESC').all();
});

ipcMain.handle('save-application', (_event, data) => {
  const stmt = db!.prepare(`
    INSERT INTO applications (
      id, role, jobTitle, company, appliedDate, salaryRange, jobUrl,
      followUpDate, resumeUsed, status, location,
      contactPerson, coverLetter, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.id,
    data.role,
    data.jobTitle,
    data.company,
    data.appliedDate,
    data.salaryRange,
    data.jobUrl,
    data.followUpDate,
    data.resumeUsed,
    data.status,
    data.location,
    data.contactPerson,
    data.coverLetter,
    data.notes
  );

  return data;
});

ipcMain.handle('update-application', (_e, data) => {
  db!.prepare(`
    UPDATE applications SET
      role = ?, jobTitle = ?, company = ?, appliedDate = ?, salaryRange = ?, jobUrl = ?,
      followUpDate = ?, resumeUsed = ?, status = ?, location = ?,
      contactPerson = ?, coverLetter = ?, notes = ?
    WHERE id = ?
  `).run(
    data.role, data.jobTitle, data.company, data.appliedDate, data.salaryRange, data.jobUrl,
    data.followUpDate, data.resumeUsed, data.status, data.location,
    data.contactPerson, data.coverLetter, data.notes, data.id
  );

  return data;
});

ipcMain.on('delete-application', (_e, id: string) => {
  db!.prepare('DELETE FROM applications WHERE id = ?').run(id);
});

app.whenReady().then(() => {
  initDB();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
