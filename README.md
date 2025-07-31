# 📂 HireLog – Job Application Tracker

**HireLog** is a lightweight, cross-platform desktop app to track job applications, visualize application stats, and stay on top of your job hunt — all from your own device with no cloud sync or external dependencies.

![HireLog Banner](./screenshots/banner.png)

---

## 📸 Screenshots

| Applications Page | Add Application | Analytics Dashboard |
|-------------------|-----------------|---------------------|
| ![Applications](./screenshots/applications-page.png) | ![Add](./screenshots/add-application-page.png) | ![Analytics](./screenshots/analytics-page.png) |

---

## 🧭 Table of Contents

1. [Features](#-features)  
2. [Installation](#-installation)  
3. [Usage](#-usage)  
4. [Tech Stack](#-tech-stack)  
5. [Folder Structure](#-folder-structure)  
6. [Development](#-development)  
7. [Export Support](#-export-support)  
8. [App Icon & Branding](#-app-icon--branding)  
9. [About](#-about)

---

## ✅ Features

- 💼 Add and manage job applications locally  
- 📊 Track application stats (daily/weekly/monthly)  
- 📂 Export applications as `.csv` or `.json`  
- 🔍 Filter, search, and sort applications easily  
- 🧠 Get insights through charts and visualizations  
- ⚡ Fast, secure, and lightweight — built with Electron + SQLite  
- ☁️ No internet required – your data stays with you  

---

## 🛠 Installation

### Mac (.dmg)

1. [Download the `.dmg` file from Releases](https://github.com/goutham2222/HireLog/releases/latest)
2. Open and drag **HireLog** to your Applications folder  
3. Run the app (you may need to allow it in **Gatekeeper** settings)

> 💡 No setup or sign-in required. The app works fully offline.

#### 🚫 Facing issues running the app?

If you're unable to open the app due to macOS security settings:

1. Open **Terminal**  
2. Type the following command (but **don’t press Enter yet**):
   ```bash
   xattr -cr 

---

## 🚀 Usage

- Click **"Add Application"** to start logging a new job  
- Use the **"Applications"** tab to search, filter, update, or delete entries  
- Navigate to **"Analytics"** to explore application trends and stats  
- Use the **"Export"** button to download your data as CSV/JSON  

---

## 🧰 Tech Stack

- ⚙️ **Electron Forge** – Desktop app framework  
- ⚛️ **React + TypeScript** – Frontend logic and UI  
- 💨 **Tailwind CSS** – Styling with utility classes  
- 📦 **better-sqlite3** – Local database  
- 📈 **Recharts** – Charts and analytics  

---

## 📁 Folder Structure

├── dist/ # Electron build output
├── dist-renderer/ # Vite-rendered frontend output
├── out/ # Auto-generated .dmg builds
├── public/ # Static files
├── scripts/ # Utility scripts (cleaning, building)
├── src/
│ ├── components/ # Reusable UI components
│ ├── database/ # SQLite logic (better-sqlite3 integration)
│ ├── hooks/ # Custom React hooks
│ ├── main/ # Electron main process code (main.ts)
│ ├── pages/ # Pages (Applications, Add, Analytics)
│ ├── preload/ # Preload script for IPC (preload.ts)
│ └── types/ # TypeScript interfaces
├── forge.config.js # Electron Forge configuration
├── package.json # Project metadata and scripts
├── vite.main.config.ts # Vite config for main process
├── vite.preload.config.ts # Vite config for preload script
└── vite.renderer.config.ts# Vite config for frontend