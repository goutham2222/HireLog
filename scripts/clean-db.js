// scripts/clean-db.js
import fs from 'fs';
import path from 'path';
import os from 'os';

const appName = 'HireLog';
const platform = os.platform();

// Default macOS path for Electron userData
let dbPath = path.join(os.homedir(), 'Library', 'Application Support', appName, 'applications.sqlite');

// 🪟 Optional: Add Windows/Linux support if needed
if (platform === 'win32') {
  dbPath = path.join(process.env.APPDATA || '', appName, 'applications.sqlite');
} else if (platform === 'linux') {
  dbPath = path.join(os.homedir(), '.config', appName, 'applications.sqlite');
}

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log(`🗑️ Deleted DB at ${dbPath}`);
} else {
  console.log(`⚠️ No DB found at ${dbPath} to delete.`);
}
