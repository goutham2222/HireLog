import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { Database } from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(app.getPath('userData'), 'job_applications.db');
const db = new Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      role TEXT,
      jobTitle TEXT,
      company TEXT,
      resumeUsed TEXT,
      appliedDate TEXT,
      status TEXT,
      coverLetter TEXT,
      jobUrl TEXT,
      notes TEXT,
      salary TEXT,
      location TEXT,
      contactPerson TEXT,
      followUpDate TEXT
    )
  `);
  console.log('[main] Database initialized at:', dbPath);
});

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // make sure this matches the built file
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-applications', () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM applications ORDER BY appliedDate DESC', [], (err, rows) => {
      if (err) {
        console.error('[main] get-applications failed:', err);
        reject(err);
      } else {
        console.log('[main] Returning', rows.length, 'applications');
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('saveApplication', async (_, application) => {
  console.log('[main] Received saveApplication:', application);
  try {
    db.run(
      `INSERT INTO applications (
        id, role, jobTitle, company, resumeUsed, appliedDate, status,
        coverLetter, jobUrl, notes, salary, location, contactPerson, followUpDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        application.id,
        application.role,
        application.jobTitle,
        application.company,
        application.resumeUsed,
        application.appliedDate,
        application.status,
        application.coverLetter,
        application.jobUrl,
        application.notes,
        application.salary,
        application.location,
        application.contactPerson,
        application.followUpDate,
      ],
      (err) => {
        if (err) {
          console.error('[main] Failed to insert application:', err.message);
        } else {
          console.log('[main] Application inserted successfully.');
        }
      }
    );
    return { success: true };
  } catch (err) {
    console.error('[main] Exception while inserting application:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('update-application', (event, id, updatedData) => {
  const keys = Object.keys(updatedData);
  const values = Object.values(updatedData);
  const setClause = keys.map(k => `${k} = ?`).join(', ');

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE applications SET ${setClause} WHERE id = ?`,
      [...values, id],
      function (err) {
        if (err) {
          console.error('[main] Failed to update:', err);
          reject(err);
        } else {
          console.log('[main] Updated application:', id);
          resolve(true);
        }
      }
    );
  });
});

ipcMain.handle('delete-application', (event, id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM applications WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('[main] Failed to delete:', err);
        reject(err);
      } else {
        console.log('[main] Deleted application:', id);
        resolve(true);
      }
    });
  });
});
