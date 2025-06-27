import { app, BrowserWindow, ipcMain } from 'electron';
  import sqlite3 from 'sqlite3';
  import { open } from 'sqlite';
  import path from 'path';

  let mainWindow: BrowserWindow | null = null;

  async function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    if (process.env.NODE_ENV === 'development') {
      mainWindow.loadURL('http://localhost:5173');
    } else {
      mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  async function initializeDatabase() {
    const db = await open({
      filename: path.join(__dirname, 'job_applications.db'),
      driver: sqlite3.Database,
    });

    await db.exec(`
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

    return db;
  }

  app.on('ready', async () => {
    await initializeDatabase();
    createWindow();

    ipcMain.handle('getApplications', async () => {
      const db = await initializeDatabase();
      const applications = await db.all('SELECT * FROM applications');
      return { success: true, data: applications };
    });

    ipcMain.handle('saveApplication', async (_, application) => {
      const db = await initializeDatabase();
      await db.run(
        'INSERT INTO applications (id, role, jobTitle, company, resumeUsed, appliedDate, status, coverLetter, jobUrl, notes, salary, location, contactPerson, followUpDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
        ]
      );
      return { success: true };
    });

    ipcMain.handle('updateApplication', async (_, id, updates) => {
      const db = await initializeDatabase();
      const setClause = Object.keys(updates)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(updates), id];
      await db.run(`UPDATE applications SET ${setClause} WHERE id = ?`, values);
      return { success: true };
    });

    ipcMain.handle('deleteApplication', async (_, id) => {
      const db = await initializeDatabase();
      await db.run('DELETE FROM applications WHERE id = ?', [id]);
      return { success: true };
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });