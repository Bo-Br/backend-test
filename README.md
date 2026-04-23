# LUSI: Strategic Growth Dashboard (Full-Stack)

**LUSI** (Leveling-Up System Interface) is a technical, RPG-inspired productivity dashboard designed to turn personal growth, habits, and task management into a gamified system. Now upgraded to a **Full-Stack Application** for synchronized progress across all devices on your local network.

---

## 🚀 Key Features

- **Character System**: Dynamic leveling and RPG-style rank evolution.
- **Custom Stats**: Track Health, Mana, Stamina, or any custom attribute.
- **Quest Engine**: Manage Main Quests, Side Quests, and infinite daily loops.
- **Threat Management**: Loss of XP for bad habits or system failures.
- **Real-time Persistence**: All data is stored on your local server and synchronized across all connected devices (phones, laptops).
- **History Log**: Detailed audit trail of all character actions and stat changes.

---

## 🛠 Full-Stack Architecture

This version has been re-engineered to run with a Node.js backend:
- **Backend**: Express.js server providing a REST API (`GET /data`, `POST /data`).
- **Persistence**: Atomic file-system storage in `data.json` with automated backups.
- **Synchronization**: Changes made on one device are saved to the server and visible to all other devices on the same network.
- **Minimalist Design**: No heavy databases required; everything runs out of a local directory.

---

## 📦 Setup & Execution (Linux Server)

To deploy this on your local Linux machine (e.g., Raspberry Pi, Home Server):

### 1. Install Dependencies
Ensure you have Node.js (v18+) installed.
```bash
npm install
```

### 2. Run the Server
The server runs on port **3000** and binds to `0.0.0.0` to be accessible on your local network.

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

### 3. Access from other devices
1. Find your server's local IP address (e.g., `192.168.1.50`).
2. Open your browser on any phone or laptop connected to the same Wi-Fi.
3. Visit: `http://192.168.1.50:3000`

---

## 📖 Global Diagnostics

- **Multilingual**: localized in EN, FR, RU.
- **Themes**: Indigo, Rose, Amber, Emerald.
- **Safety**: Atomic write protocol prevents data corruption; `data.json.bak` stores the previous state.
