# LUSI: Strategic Growth Dashboard (Full-Stack)

**LUSI** (Leveling-Up System Interface) is a technical, RPG-inspired productivity dashboard designed to turn personal growth, habits, and task management into a gamified system.

This version is a **Full-Stack Application** specifically engineered for Linux servers. It replaces basic `localStorage` with a **centralized, consistent database** (server-side JSON) that synchronizes progress across all connected devices (phones, laptops) on your local network.

---

## 🚀 Key Features

- **Centralized Persistence**: All progress is saved to `data.json` on the server. Opening the app from any device shows the exact same up-to-date state.
- **Character System**: Dynamic leveling and RPG-style rank evolution.
- **Custom Stats**: Track Health, Mana, Stamina, or any custom attribute.
- **Quest Engine**: Manage Main Quests, Side Quests, and infinite daily loops.
- **Threat Management**: Loss of XP for bad habits or system failures.
- **Atomic Safety**: Uses a temp-write & rename strategy on the server to prevent data corruption during saves.
- **History Log**: Audit trail of all character actions and stat changes.

---

## 🛠 Full-Stack Architecture

- **Backend**: Node.js (Express) server providing a REST API (`GET /data`, `POST /data`).
- **Database**: `data.json` file on the server. It includes a basic locking mechanism (write queue) to handle simultaneous requests from multiple devices.
- **Frontend**: React-based dashboard that handles debounced synchronization with the server.

---

## 📦 Setup & Execution (Linux Server)

To deploy this on your local Linux machine (e.g., Raspberry Pi, Home Server, or a PC in `/var/www`):

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Permissions & Deployment
If deploying in `/var/www/`, you must ensure your user has permissions to write files:

```bash
# Move to the directory
cd /var/www/lusi-app

# Grant ownership to your user
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### 3. Build & Install
```bash
# 1. Install dependencies
npm install

# 2. Build the application (Frontend + Backend)
npm run build
```

### 4. Running the Server

**Modern Production Mode (Recommended):**
```bash
# This starts the compiled server (dist/server.js) in production mode
npm start
```

**Access from other devices:**
1. Find your server's local IP (e.g., `192.168.1.50`).
2. Visit `http://192.168.1.50:3000` from any device on your Wi-Fi.

---

## 🖥 Systemd Service (Autostart)
To ensure the app starts automatically when your Linux server boots, create a service file:

`/etc/systemd/system/lusi.service`:
```ini
[Unit]
Description=LUSI RPG Dashboard
After=network.target

[Service]
WorkingDirectory=/var/www/lusi-app
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
# You can override the port if needed
Environment=PORT=3000
User=votre-user

[Install]
WantedBy=multi-user.target
```
Then run:
`sudo systemctl daemon-reload && sudo systemctl enable lusi && sudo systemctl start lusi`

---

## 📖 Reliability Details

- **Database Consistency**: The app uses a 1-second debounce before saving changes. If you make changes on a phone, they will appear on your laptop after a refresh (or vice versa).
- **Atomic Write**: The server saves data to `data.tmp` and then performs an atomic `rename` to `data.json`. This prevents "half-written" files if power is lost.
- **Backups**: Every save creates a `data.json.bak` of the *previous* state.
- **No LocalStorage**: The primary state is **never** stored in the browser's persistent storage; it is always derived from the server on load.
